import { initiateTask, validateObject } from "figurl"
import { isArrayOf, isString, optional } from "figurl/viewInterface/validateObject"
import React, { FunctionComponent, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useReducer } from "react"
import Job, { isJob, JobStatus } from "./Job"

type JobsState = {
    jobs?: Job[]
    selectedJobIds?: string[]
    currentJobId?: string
    currentFolder?: string
}

const isJobsState = (x: any): x is JobsState => {
    return validateObject(x, {
        jobs: optional(isArrayOf(isJob)),
        selectedJobIds: optional(isArrayOf(isString)),
        currentJobId: optional(isString),
        currentFolder: optional(isString)
    })
}

type JobsAction = {
    type: 'addJob'
    job: Job
} | {
    type: 'setSelectedJobIds'
    jobIds: string[]
} | {
    type: 'selectJob'
    jobId: string
    selected: boolean
} | {
    type: 'setCurrentJobId'
    jobId: string | undefined
} | {
    type: 'deleteJobs'
    jobIds: string[]
} | {
    type: 'setJobStatus'
    jobId: string
    status: JobStatus
    error?: string
} | {
    type: 'setCurrentFolder'
    folder?: string
} | {
    type: 'moveJobsToFolder'
    jobIds: string[]
    folder: string
}

const jobsReducer = (s: JobsState, a: JobsAction): JobsState => {
    if (a.type === 'addJob') {
        return {
            ...s,
            jobs: [...(s?.jobs || emptyJobsList), a.job]
        }
    }
    else if (a.type === 'setSelectedJobIds') {
        return {
            ...s,
            selectedJobIds: a.jobIds
        }
    }
    else if (a.type === 'selectJob') {
        if (a.selected) {
            return {
                ...s,
                selectedJobIds: [...(s?.selectedJobIds || []).filter(id => (id !== a.jobId)), a.jobId]
            }
        }
        else {
            return {
                ...s,
                selectedJobIds: [...(s?.selectedJobIds || []).filter(id => (id !== a.jobId))]
            }
        }
    }
    else if (a.type === 'setCurrentJobId') {
        return {
            ...s,
            currentJobId: a.jobId
        }
    }
    else if (a.type === 'deleteJobs') {
        const idSet = new Set(a.jobIds)
        return {
            ...s,
            selectedJobIds: (s.selectedJobIds || []).filter(id => (!idSet.has(id))),
            currentJobId: idSet.has(s.currentJobId || '') ? undefined : s.currentJobId,
            jobs: (s.jobs || []).filter(job => (!idSet.has(job.jobId)))
        }
    }
    else if (a.type === 'setJobStatus') {
        return {
            ...s,
            jobs: (s.jobs || []).map(job => (job.jobId === a.jobId ? {...job, status: a.status, error: a.error} : job))
        }
    }
    else if (a.type === 'setCurrentFolder') {
        return {
            ...s,
            currentFolder: a.folder
        }
    }
    else if (a.type === 'moveJobsToFolder') {
        const idSet = new Set(a.jobIds)
        return {
            ...s,
            jobs: (s.jobs || []).map(job => (idSet.has(job.jobId) ? {...job, folder: a.folder} : job))
        }
    }
    else return s
}

const emptyJobsList: Job[] = []
const emptyJobsState: JobsState = {}

const JobsContext = React.createContext<{
    jobsState: JobsState,
    jobsDispatch?: (a: JobsAction) => void
}>({jobsState: emptyJobsState})

export const useJobs = () => {
    const c = useContext(JobsContext)
    const {jobsState, jobsDispatch} = c

    const addJob = useCallback((job: Job) => {
        initiateTask({
            taskName: job.function.name,
            taskInput: job.inputArguments,
            taskType: 'calculation',
            onStatusChanged: () => {}
        }).then(task => {
            if (task) {
                job.taskJobId = task.taskJobId
                job.returnValueUrl = task.resultUrl
                jobsDispatch && jobsDispatch({type: 'addJob', job})
                const updateStatus = () => {
                    jobsDispatch && jobsDispatch({type: 'setJobStatus', jobId: job.jobId, status: task.status, error: task.errorMessage})
                }
                task.onStatusChanged(updateStatus)
                updateStatus()
            }
        })
    }, [jobsDispatch])

    const selectJob = useCallback((jobId: string, selected: boolean) => {
        jobsDispatch && jobsDispatch({type: 'selectJob', jobId, selected})
    }, [jobsDispatch])

    const setSelectedJobIds = useCallback((jobIds: string[]) => {
        jobsDispatch && jobsDispatch({type: 'setSelectedJobIds', jobIds})
    }, [jobsDispatch])

    const setCurrentJob = useCallback((job: Job | undefined) => {
        jobsDispatch && jobsDispatch({type: 'setCurrentJobId', jobId: job ? job.jobId : undefined})
    }, [jobsDispatch])

    const deleteJobs = useCallback((jobIds: string[]) => {
        jobsDispatch && jobsDispatch({type: 'deleteJobs', jobIds})
    }, [jobsDispatch])

    const setJobStatus = useCallback((jobId: string, status: JobStatus) => {
        jobsDispatch && jobsDispatch({type: 'setJobStatus', jobId, status})
    }, [jobsDispatch])

    const moveJobsToFolder = useCallback((jobIds: string[], folder: string) => {
        jobsDispatch && jobsDispatch({type: 'moveJobsToFolder', jobIds, folder})
    }, [jobsDispatch])

    const setCurrentFolder = useCallback((folder?: string) => {
        jobsDispatch && jobsDispatch({type: 'setCurrentFolder', folder})
        const {selectedJobIds} = jobsState
        if (selectedJobIds) {
            const jobsById: {[key: string]: Job} = {}
            for (let job of jobsState.jobs || []) {
                jobsById[job.jobId] = job
            }
            const newSelectedJobIds = selectedJobIds.filter(jobId => (
                (jobsById[jobId].folder || 'Default') === (folder || 'Default')
            ))
            setSelectedJobIds(newSelectedJobIds)
        }
    }, [jobsDispatch, jobsState, setSelectedJobIds])

    const folders: string[] = useMemo(() => {
        const ret: string[] = []
        ret.push('Default')
        ret.push('Archive')
        const allFolders = (jobsState.jobs || []).map(job => (job.folder)).filter(folder => (folder !== undefined)) as string[]
        const allFoldersUnique = [...new Set(allFolders)].sort().filter(f => (!['Archive', 'Default'].includes(f)))
        for (let folder of allFoldersUnique) {
            ret.push(folder)
        }
        return ret
    }, [jobsState.jobs])

    const jobs = useMemo(() => (
        (jobsState.jobs || emptyJobsList).filter(job => (
            (job.folder || 'Default') === (jobsState.currentFolder || 'Default')
        ))
    ), [jobsState.jobs, jobsState.currentFolder])

    const jobsSorted = useMemo(() => (
        (jobs.sort((a, b) => (b.timestampCreated - a.timestampCreated)))
    ), [jobs])

    return {
        jobs: jobsSorted,
        selectedJobIds: jobsState.selectedJobIds || [],
        currentJob: (jobsState.jobs || []).filter(job => (job.jobId === jobsState.currentJobId))[0],
        folders,
        currentFolder: jobsState.currentFolder,
        selectJob,
        setSelectedJobIds,
        addJob,
        setCurrentJob,
        deleteJobs,
        setJobStatus,
        setCurrentFolder,
        moveJobsToFolder
    }
}

const initialState: JobsState = (() => {
    const a = localStorage['draculus-jobs-state-v1']
    if (!a) return emptyJobsState
    let b: any
    try {
        b = JSON.parse(a)
    }
    catch(err) {
        console.warn('Problem parsing json of jobs state')
        return emptyJobsState
    }
    if (!isJobsState(b)) {
        console.warn('Problem with format of jobs state')
        localStorage['draculus-jobs-state-v1-backup'] = a
        return emptyJobsState
    }
    return b
})()

export const SetupJobs: FunctionComponent<PropsWithChildren<{}>> = (props) => {
    const [jobsState, jobsDispatch] = useReducer(jobsReducer, initialState)
    const value = useMemo(() => ({jobsState, jobsDispatch}), [jobsState, jobsDispatch])
    useEffect(() => {
        localStorage['draculus-jobs-state-v1'] = JSON.stringify(jobsState)
    }, [jobsState])
    return (
        <JobsContext.Provider value={value}>
            {props.children}
        </JobsContext.Provider>
    )
}

export default JobsContext
import { initiateTask, validateObject } from "figurl"
import { isArrayOf, isString, optional } from "figurl/viewInterface/validateObject"
import React, { FunctionComponent, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useReducer } from "react"
import Job, { isJob, JobStatus } from "./Job"

type JobsState = {
    jobs?: Job[]
    selectedJobIds?: string[]
    currentJobId?: string
}

const isJobsState = (x: any): x is JobsState => {
    return validateObject(x, {
        jobs: optional(isArrayOf(isJob)),
        selectedJobIds: optional(isArrayOf(isString)),
        currentJobId: optional(isString)
    })
}

type JobsAction = {
    type: 'addJob',
    job: Job
} | {
    type: 'setSelectedJobIds',
    jobIds: string[]
} | {
    type: 'selectJob',
    jobId: string
    selected: boolean
} | {
    type: 'setCurrentJobId',
    jobId: string | undefined
} | {
    type: 'deleteJobs',
    jobIds: string[]
} | {
    type: 'setJobStatus',
    jobId: string,
    status: JobStatus
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
            jobs: (s.jobs || []).map(job => (job.jobId === a.jobId ? {...job, status: a.status} : job))
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
            taskName: job.functionName,
            taskInput: job.inputArguments,
            taskType: 'calculation',
            onStatusChanged: () => {}
        }).then(task => {
            if (task) {
                job.taskJobId = task.taskJobId
                jobsDispatch && jobsDispatch({type: 'addJob', job})
                const updateStatus = () => {
                    jobsDispatch && jobsDispatch({type: 'setJobStatus', jobId: job.jobId, status: task.status})
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

    return {
        jobs: jobsState.jobs || emptyJobsList,
        selectedJobIds: jobsState.selectedJobIds || [],
        currentJob: (jobsState.jobs || []).filter(job => (job.jobId === jobsState.currentJobId))[0],
        selectJob,
        setSelectedJobIds,
        addJob,
        setCurrentJob,
        deleteJobs
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
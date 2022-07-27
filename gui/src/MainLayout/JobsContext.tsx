import React, { FunctionComponent, PropsWithChildren, useCallback, useContext, useMemo, useReducer } from "react"
import Job from "./Job"

const urlSearchParams = new URLSearchParams(window.location.search)
const queryParams = Object.fromEntries(urlSearchParams.entries())
export const initialUrlState = JSON.parse(queryParams.s || '{}')

type JobsState = {
    jobs?: Job[]
    selectedJobIds?: string[]
    currentJob?: Job
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
    type: 'setCurrentJob',
    job: Job | undefined
}

const jobsReducer = (s: JobsState, a: JobsAction) => {
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
    else if (a.type === 'setCurrentJob') {
        return {
            ...s,
            currentJob: a.job
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
        jobsDispatch && jobsDispatch({type: 'addJob', job})
    }, [jobsDispatch])

    const selectJob = useCallback((jobId: string, selected: boolean) => {
        jobsDispatch && jobsDispatch({type: 'selectJob', jobId, selected})
    }, [jobsDispatch])

    const setCurrentJob = useCallback((job: Job | undefined) => {
        jobsDispatch && jobsDispatch({type: 'setCurrentJob', job})
    }, [jobsDispatch])

    return {
        jobs: jobsState.jobs || emptyJobsList,
        selectedJobIds: jobsState.selectedJobIds || [],
        currentJob: jobsState.currentJob,
        selectJob,
        addJob,
        setCurrentJob
    }
}

export const SetupJobs: FunctionComponent<PropsWithChildren<{}>> = (props) => {
    const [jobsState, jobsDispatch] = useReducer(jobsReducer, emptyJobsState)
    const value = useMemo(() => ({jobsState, jobsDispatch}), [jobsState, jobsDispatch])
    return (
        <JobsContext.Provider value={value}>
            {props.children}
        </JobsContext.Provider>
    )
}

export default JobsContext
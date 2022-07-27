import React, { FunctionComponent, PropsWithChildren, useCallback, useContext, useMemo, useReducer } from "react"
import Job from "./Job"

const urlSearchParams = new URLSearchParams(window.location.search)
const queryParams = Object.fromEntries(urlSearchParams.entries())
export const initialUrlState = JSON.parse(queryParams.s || '{}')

type JobsAction = {
    type: 'addJob',
    job: Job
}

const jobsReducer = (s: Job[] | undefined, a: JobsAction) => {
    if (a.type === 'addJob') {
        return [...(s || emptyJobsList), a.job]
    }
    else return s
}

const JobsContext = React.createContext<{
    jobs?: Job[],
    jobsDispatch?: (a: JobsAction) => void
}>({})

const emptyJobsList: Job[] = []

export const useJobs = () => {
    const c = useContext(JobsContext)
    const {jobs, jobsDispatch} = c

    const addJob = useCallback((job: Job) => {
        jobsDispatch && jobsDispatch({type: 'addJob', job})
    }, [jobsDispatch])

    return {
        jobs: jobs || emptyJobsList,
        addJob
    }
}

export const SetupJobs: FunctionComponent<PropsWithChildren<{}>> = (props) => {
    const [jobs, jobsDispatch] = useReducer(jobsReducer, emptyJobsList)
    const value = useMemo(() => ({jobs, jobsDispatch}), [jobs, jobsDispatch])
    return (
        <JobsContext.Provider value={value}>
            {props.children}
        </JobsContext.Provider>
    )
}

export default JobsContext
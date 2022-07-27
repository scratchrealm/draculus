export type JobStatus = 'waiting' | 'started' | 'error' | 'finished'

type Job = {
    jobId: string
    functionName: string
    inputArguments: {[name: string]: any}
    status: JobStatus
}

export default Job
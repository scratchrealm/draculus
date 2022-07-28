import { validateObject } from "figurl"
import { isString, optional } from "figurl/viewInterface/validateObject"

export type JobStatus = 'waiting' | 'started' | 'error' | 'finished'

type Job = {
    jobId: string
    functionName: string
    inputArguments: {[name: string]: any}
    status: JobStatus
    taskJobId?: string
}

export const isJob = (x: any): x is Job => {
    return validateObject(x, {
        jobId: isString,
        functionName: isString,
        inputArguments: () => (true),
        status: isString,
        taskJobId: optional(isString)
    })
}

export default Job
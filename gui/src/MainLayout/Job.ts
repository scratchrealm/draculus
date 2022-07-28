import { validateObject } from "figurl"
import { isNumber, isString, optional } from "figurl/viewInterface/validateObject"
import { DrFunction, isDrFunction } from "MainComponent/DraculusData"

export type JobStatus = 'waiting' | 'started' | 'error' | 'finished'

type Job = {
    jobId: string
    function: DrFunction
    inputArguments: {[name: string]: any}
    status: JobStatus
    timestampCreated: number
    folder?: string
    taskJobId?: string
    returnValueUrl?: string
    error?: string
    // intentionally don't store return value here, because it might be very large
    // may consider storing it conditionally for cases where it is small
}

export const isJob = (x: any): x is Job => {
    return validateObject(x, {
        jobId: isString,
        function: isDrFunction,
        inputArguments: () => (true),
        status: isString,
        timestampCreated: isNumber,
        folder: optional(isString),
        taskJobId: optional(isString),
        returnValueUrl: optional(isString),
        error: optional(isString)
    })
}

export default Job
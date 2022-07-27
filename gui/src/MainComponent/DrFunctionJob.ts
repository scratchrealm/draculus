import { Task } from "figurl"
import { DrFunction } from "./DraculusData"

type DrFunctionJob = {
    jobId: string
    function: DrFunction
    parameterValues: {[name: string]: any}
}

export default DrFunctionJob
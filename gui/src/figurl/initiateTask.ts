import sendRequestToParent from "./sendRequestToParent";
import { InitiateTaskRequest, isInitiateTaskResponse } from "./viewInterface/FigurlRequestTypes";
import { TaskJobStatus, TaskStatusUpdateMessage, TaskType } from "./viewInterface/MessageToChildTypes";

const allTasks: {[key: string]: Task<any>} = {}

export class Task<ReturnType> {
    #onStatusChangedCallbacks: (() => void)[] = []
    #taskJobId: string
    #status: TaskJobStatus
    #errorMessage?: string = undefined
    #result: ReturnType | undefined = undefined
    #resultUrl: string | undefined = undefined
    #canceled = false
    constructor(a: {taskJobId: string, status: TaskJobStatus, returnValue?: any, returnValueUrl?: string}) {
        this.#taskJobId = a.taskJobId
        this.#status = a.status
        if (this.#status === 'finished') {
            this.#result = a.returnValue as any as ReturnType
        }
        this.#resultUrl = a.returnValueUrl
    }
    onStatusChanged(cb: () => void) {
        this.#onStatusChangedCallbacks.push(cb)
    }
    public get taskJobId() {
        return this.#taskJobId
    }
    public get status() {
        return this.#status
    }
    public get errorMessage() {
        return this.#errorMessage
    }
    public get result() {
        return this.#result
    }
    public get resultUrl() {
        return this.#resultUrl
    }
    cancel() {
        this.#canceled = true
        // todo: send a cancel message
    }
    _handleStatusChange(status: TaskJobStatus, o: {errorMessage?: string, returnValue?: any}) {
        if (this.#canceled) return
        if (status === this.#status) return
        this.#status = status
        if (status === 'error') {
            this.#errorMessage = o.errorMessage
        }
        if (status === 'finished') {
            this.#result = o.returnValue as any as ReturnType
        }
        this.#onStatusChangedCallbacks.forEach(cb => {cb()})
    }
}

const initiateTask = async <ReturnType>(args: {taskName: string | undefined, taskInput: {[key: string]: any}, taskType: TaskType, onStatusChanged: () => void}) => {
    const { taskName, taskInput, taskType, onStatusChanged } = args
    if (!taskName) return undefined

    const req: InitiateTaskRequest = {
        type: 'initiateTask',
        taskName,
        taskInput,
        taskType
    }
    const resp = await sendRequestToParent(req)
    if (!isInitiateTaskResponse(resp)) throw Error('Unexpected response to initiateTask')

    const {taskJobId, status, returnValue, returnValueUrl} = resp

    let t: Task<ReturnType>
    if (taskJobId.toString() in allTasks) {
        t = allTasks[taskJobId.toString()]
    }
    else {
        t = new Task<ReturnType>({taskJobId, status, returnValue, returnValueUrl})
        allTasks[taskJobId.toString()] = t
    }
    t.onStatusChanged(onStatusChanged)
    return t
}

export const handleTaskStatusUpdate = (msg: TaskStatusUpdateMessage) => {
    const {taskJobId, status, errorMessage, returnValue} = msg
    if (taskJobId.toString() in allTasks) {
        const task = allTasks[taskJobId.toString()]
        task._handleStatusChange(status, {errorMessage, returnValue})
    }
}

export const getAllTasks = () => {
    return allTasks
}

export const getTask = (taskJobId: string) => {
    return allTasks[taskJobId]
}

export const cancelTask = (taskJobId: string) => {
    const task = allTasks[taskJobId]
    if (!task) return
    task.cancel()
    delete allTasks[taskJobId]
}

export default initiateTask
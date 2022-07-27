import React from 'react'
import { FunctionComponent } from "react"
import { Task } from './initiateTask'
import { TaskJobStatus } from './viewInterface/MessageToChildTypes'

type Props = {
    label: string
    taskStatus: TaskJobStatus | undefined
    task: Task<any> | undefined
}

const TaskStatusView: FunctionComponent<Props> = ({label, taskStatus, task}) => {
    if (!task) return (
        <div>Waiting for task: {label}</div>
    )
    if ((taskStatus === 'waiting') || (taskStatus === 'started') || (taskStatus === 'finished')) {
        return <div>{label ? label + ': ' : ''}{taskStatus}</div>
    }
    else if (taskStatus === 'error') {
        return <div>Error running {label}: {task.errorMessage}</div>
    }
    else {
        return <div>{label}: Unexpected status: {taskStatus}</div>
    }
}

export default TaskStatusView
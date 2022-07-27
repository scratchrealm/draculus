import { Button } from "@material-ui/core";
import { Task, TaskStatusView, useCalculationTask } from "figurl";
import { TaskJobStatus } from "figurl/viewInterface/MessageToChildTypes";
import { FunctionComponent, useEffect } from "react";
import DrFunctionJob from "./DrFunctionJob";
import OutputDisplay from "./OutputDisplay";

type Props = {
    job: DrFunctionJob
    onTaskStatusChange: (job: DrFunctionJob, task: Task<any> | undefined, taskStatus: TaskJobStatus | undefined) => void
    onCancel: () => void
}

const JobWidget: FunctionComponent<Props> = ({job, onTaskStatusChange, onCancel}) => {
    console.log('----- x', job.parameterValues)
    const {returnValue, task, taskStatus} = useCalculationTask<any>(job.function.name, job.parameterValues)
    useEffect(() => {
        onTaskStatusChange(job, task, taskStatus)
    }, [job, task, taskStatus, onTaskStatusChange])

    if (task?.status !== 'finished') {
        return (
            <div>
                <TaskStatusView task={task} taskStatus={taskStatus} label={job.function.name} />
                <Button onClick={onCancel}>Cancel job</Button>
            </div>
        )
    }
    else {
        return (
            <div>
                <h3>Task completed.</h3>
                <div>Output:</div>
                <div>&nbsp;</div>
                <OutputDisplay
                    drFunction={job.function}
                    output={returnValue}
                />
            </div>
        )
    }
    
}

export default JobWidget
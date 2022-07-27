import { Button, Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import { Task, TaskStatusView, useCalculationTask } from "figurl";
import { TaskJobStatus } from "figurl/viewInterface/MessageToChildTypes";
import { FunctionComponent, useEffect } from "react";
import DrFunctionJob from "./DrFunctionJob";

type Props = {
    job: DrFunctionJob
    onTaskStatusChange: (job: DrFunctionJob, task: Task<any> | undefined, taskStatus: TaskJobStatus | undefined) => void
    onCancel: () => void
}

const JobWidget: FunctionComponent<Props> = ({job, onTaskStatusChange, onCancel}) => {
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
                Task completed.
                <Table className="Table1" style={{maxWidth: 200}}>
                    <TableBody>
                        <TableRow>
                            <TableCell>Output</TableCell>
                            <TableCell>{returnValue}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        )
    }
    
}

export default JobWidget
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core"
import { FunctionComponent } from "react"
import Job from "./Job"

type Props = {
    job: Job
    left: number
    top: number
    width: number
    height: number
}

const JobView: FunctionComponent<Props> = ({job, left, top, width, height}) => {
    return (
        <div style={{left, top, width, height, position: "absolute", overflowY: "auto"}}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Job ID</TableCell>
                        <TableCell>{job.jobId}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Function name</TableCell>
                        <TableCell>{job.functionName}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Input arguments</TableCell>
                        <TableCell>{JSON.stringify(job.inputArguments)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>{job.status}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default JobView
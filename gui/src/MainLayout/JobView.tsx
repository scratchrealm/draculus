import { Table, TableBody, TableCell, TableRow } from "@material-ui/core"
import { FunctionComponent } from "react"
import Job from "./Job"

type Props = {
    job: Job
    width: number
    height: number
}

const JobView: FunctionComponent<Props> = ({job, width, height}) => {
    const margin = 20
    return (
        <div style={{width: width - margin * 2, height: height - margin * 2, position: "absolute", overflowY: "auto", margin}}>
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
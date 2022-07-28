import { Table, TableBody } from "@material-ui/core"
import { FunctionComponent, useMemo } from "react"
import Job from "./Job"
import { useJobs } from "./JobsContext"
import JobsTableRow from "./JobsTableRow"

type Props = {
    left: number
    top: number
    width: number
    height: number
    onJobClick: (job: Job) => void
}

const JobsTable: FunctionComponent<Props> = ({onJobClick, left, top, width, height}) => {
    const {jobs, selectedJobIds} = useJobs()
    const selectedJobIdsSet = useMemo(() => (new Set(selectedJobIds)), [selectedJobIds])
    return (
        <div style={{left, top, width, height, position: "absolute", overflowY: "auto"}}>
            <Table className="Table2">
                <TableBody>
                    {
                        jobs.map(job => (
                            <JobsTableRow key={job.jobId} onClick={onJobClick} job={job} width={width} selected={selectedJobIdsSet.has(job.jobId)} />
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default JobsTable
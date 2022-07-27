import { Checkbox, TableCell, TableRow } from "@material-ui/core"
import { FunctionComponent, useCallback, useMemo } from "react"
import Job from "./Job"
import { useJobs } from "./JobsContext"
import StatusIcon from "./StatusIcon"

type Props = {
    width: number
    job: Job
    selected: boolean
    onClick: (job: Job) => void
}

const s: React.CSSProperties = {
    padding: 0
}

const JobsTableRow: FunctionComponent<Props> = ({job, width, selected, onClick}) => {
    const {selectJob} = useJobs()
    const widths: number[] = useMemo(() => {
        const ret = [43, 43, 200, 0, 72]
        ret[3] = width - ret[0] - ret[1] - ret[2] - ret[4]
        return ret
    }, [width])
    const handleClickBox = useCallback(() => {
        selectJob(job.jobId, !selected)
    }, [selected, job.jobId, selectJob])
    const col = useMemo(() => (
        selected ? 'lightblue' : undefined
    ), [selected])
    const handleClick = useCallback(() => {
        onClick(job)
    }, [onClick, job])
    return (
        <TableRow onClick={handleClick} style={{background: col}} className="JobsTableRow">
            <TableCell style={{width: widths[0], ...s}}><Checkbox onClick={handleClickBox} checked={selected} /></TableCell>
            <TableCell style={{width: widths[1], ...s}}><StatusIcon status={job.status} /></TableCell>
            <TableCell style={{width: widths[2], ...s}}>{job.functionName}</TableCell>
            <TableCell style={{width: widths[3], ...s}}>{JSON.stringify(job.inputArguments)}</TableCell>
            <TableCell style={{width: widths[4], ...s}}>test</TableCell>
        </TableRow>
    )
}

export default JobsTableRow
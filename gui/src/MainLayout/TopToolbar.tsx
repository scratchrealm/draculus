import { Checkbox, IconButton } from "@material-ui/core"
import { Delete, KeyboardBackspace } from "@material-ui/icons"
import { FunctionComponent, useCallback } from "react"
import { useJobs } from "./JobsContext"

type Props = {
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
}

const TopToolbar: FunctionComponent<Props> = ({left, top, width, height, backgroundColor}) => {
    const {currentJob, setCurrentJob, deleteJobs, selectedJobIds, jobs, setSelectedJobIds} = useJobs()
    const allJobsSelected = (selectedJobIds.length === jobs.length) && jobs.length > 0
    const someJobsSelected = selectedJobIds.length > 0
    const handleSelectJobsClick = useCallback(() => {
        if (someJobsSelected) {
            setSelectedJobIds([])
        }
        else {
            setSelectedJobIds(jobs.map(j => (j.jobId)))
        }
    }, [jobs, setSelectedJobIds, someJobsSelected])
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor, borderTop: 'solid 1px gray'}}>
            {
                jobs.length > 0 && (!currentJob) && (
                    <span style={{paddingLeft: 8}}>
                        <Checkbox onClick={handleSelectJobsClick} checked={someJobsSelected} indeterminate={someJobsSelected && !allJobsSelected} />
                    </span>
                )
            }
            {
                currentJob ? (
                    <span>
                        <IconButton onClick={() => setCurrentJob(undefined)}><KeyboardBackspace /></IconButton>
                        <IconButton onClick={() => deleteJobs([currentJob.jobId])}><Delete /></IconButton>
                    </span>
                ) : (
                    selectedJobIds.length > 0 ? (
                        <span>
                            <IconButton onClick={() => deleteJobs(selectedJobIds)}><Delete /></IconButton>
                        </span>
                    ) : <span />
                )
            }
        </div>
    )
}

export default TopToolbar
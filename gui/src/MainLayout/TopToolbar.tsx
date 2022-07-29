import { Checkbox, IconButton } from "@material-ui/core"
import { Archive, Delete, KeyboardBackspace, Unarchive } from "@material-ui/icons"
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
    const {currentJob, setCurrentJob, deleteJobs, selectedJobIds, jobs, setSelectedJobIds, currentFolder, moveJobsToFolder} = useJobs()
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
                        {
                            currentJob.folder !== 'Archive' && (
                                <IconButton title="Archive job" onClick={() => {moveJobsToFolder([currentJob.jobId], 'Archive'); setCurrentJob(undefined); setSelectedJobIds([]);}}><Archive /></IconButton>
                            )
                        }
                        {
                            currentJob.folder === 'Archive' && (
                                <IconButton title="Delete job" onClick={() => deleteJobs([currentJob.jobId])}><Delete /></IconButton>
                            )
                        }
                        {
                            currentJob.folder === 'Archive' && (
                                <IconButton title="Unarchive job" onClick={() => {moveJobsToFolder([currentJob.jobId], 'Default'); setCurrentJob(undefined); setSelectedJobIds([]);}}><Unarchive /></IconButton>
                            )
                        }
                    </span>
                ) : ( // !currentJob
                    <span>
                        {
                            (selectedJobIds.length > 0) && (currentFolder !== 'Archive') && (
                                <IconButton title="Archive jobs" onClick={() => {moveJobsToFolder(selectedJobIds, 'Archive'); setSelectedJobIds([]);}}><Archive /></IconButton>
                            )
                        }
                        {
                            (selectedJobIds.length > 0) && (currentFolder === 'Archive') && (
                                <IconButton title="Unarchive jobs" onClick={() => {moveJobsToFolder(selectedJobIds, 'Default'); setSelectedJobIds([]);}}><Unarchive /></IconButton>
                            )
                        }
                        {
                            (selectedJobIds.length > 0) && (currentFolder === 'Archive') && (
                                <IconButton title="Delete jobs" onClick={() => deleteJobs(selectedJobIds)}><Delete /></IconButton>
                            )
                        }
                    </span>
                )
            }
        </div>
    )
}

export default TopToolbar
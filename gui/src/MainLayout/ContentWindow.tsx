import { FunctionComponent, useCallback } from "react"
import Job from "./Job"
import { useJobs } from "./JobsContext"
import JobsTable from "./JobsTable"
import JobView from "./JobView"

type Props = {
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
    onCreateNewJobBasedOnCurrent: () => void
}

const ContentWindow: FunctionComponent<Props> = ({left, top, width, height, backgroundColor, onCreateNewJobBasedOnCurrent}) => {
    const {setCurrentJob, currentJob} = useJobs()
    const handleJobClick = useCallback((job: Job) => {
        setCurrentJob(job)
    }, [setCurrentJob])
    const margin = 8
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor}}>
            {
                currentJob === undefined ? (
                    <JobsTable onJobClick={handleJobClick} left={margin} top={margin} width={width - margin * 2} height={height - margin * 2} />
                ) : (
                    <JobView job={currentJob} left={margin} top={margin} width={width - margin * 2} height={height - margin * 2} onCreateNewJobBasedOnCurrent={onCreateNewJobBasedOnCurrent} />
                )
            }
        </div>
    )
}

export default ContentWindow
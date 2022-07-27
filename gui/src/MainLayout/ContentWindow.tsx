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
}

const ContentWindow: FunctionComponent<Props> = ({left, top, width, height, backgroundColor}) => {
    const {setCurrentJob, currentJob} = useJobs()
    const handleJobClick = useCallback((job: Job) => {
        setCurrentJob(job)
    }, [setCurrentJob])
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor}}>
            {
                currentJob === undefined ? (
                    <JobsTable onJobClick={handleJobClick} width={width} height={height} />
                ) : (
                    <JobView job={currentJob} width={width} height={height} />
                )
            }
        </div>
    )
}

export default ContentWindow
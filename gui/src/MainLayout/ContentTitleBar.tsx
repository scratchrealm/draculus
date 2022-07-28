import { FunctionComponent } from "react"
import { useJobs } from "./JobsContext"

type Props = {
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
}

const ContentTitleBar: FunctionComponent<Props> = ({left, top, width, height, backgroundColor}) => {
    const {currentJob, currentFolder} = useJobs()
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor, borderTop: 'solid 1px rgb(170, 170, 170)'}}>
            <div style={{paddingLeft: 20, paddingTop: 5, fontSize: 16, fontWeight: 'normal', fontStyle: 'italic'}}>
                {
                    currentJob ? (
                        <span>Job: {currentJob.function.name} ({currentJob.jobId})</span>
                    ) : (
                        <span>Folder: {currentFolder || 'Default'}</span>
                    )
                }
            </div>
        </div>
    )
}

export default ContentTitleBar
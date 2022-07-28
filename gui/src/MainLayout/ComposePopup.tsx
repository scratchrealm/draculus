import { FunctionComponent, useCallback, useState } from "react"
import ComposeBottomToolbar from "./ComposeBottomToolbar"
import ComposeContent from "./ComposeContent"
import ComposeTopBar from "./ComposeTopBar"
import Job from "./Job"
import { useJobs } from "./JobsContext"

type Props = {
    onClose: () => void
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
}

const bottomToolbarHeight = 60
const topBarHeight = 40

const ComposePopup: FunctionComponent<Props> = ({onClose, left, top, width, height, backgroundColor}) => {
    const [newJob, setNewJob] = useState<Job | undefined>(undefined)
    const {addJob} = useJobs()
    const handleSubmit = useCallback(() => {
        if (!newJob) return
        addJob(newJob)
        onClose()
    }, [addJob, newJob, onClose])
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor, border: 'solid 1px black'}}>
            <ComposeTopBar
                onClose={onClose}
                title="Create new job"
                backgroundColor="black"
                width={width} height={topBarHeight} left={0} top={0}
            />
            <ComposeContent
                left={0}
                top={topBarHeight}
                width={width}
                height={height - topBarHeight - bottomToolbarHeight}
                setNewJob={setNewJob}
            />
            <ComposeBottomToolbar
                onSubmit={handleSubmit}
                backgroundColor="rgb(240, 220, 200)"
                okayToSubmit={newJob !== undefined}
                width={width} height={bottomToolbarHeight} left={0} top={height - bottomToolbarHeight}
            />
        </div>
    )
}

export default ComposePopup
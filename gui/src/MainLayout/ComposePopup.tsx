import randomAlphaString from "figurl/util/randomAlphaString"
import { FunctionComponent, useCallback } from "react"
import ComposeBottomToolbar from "./ComposeBottomToolbar"
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
    const {addJob} = useJobs()
    const handleSubmit = useCallback(() => {
        console.log('--- hs')
        const job: Job = {
            jobId: randomAlphaString(10),
            functionName: 'test-function',
            inputArguments: {param1: 1, param2: 2},
            status: 'waiting'
        }
        addJob(job)
        onClose()
    }, [addJob, onClose])
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor}}>
            <ComposeTopBar
                onClose={onClose}
                title="Create new job"
                backgroundColor="black"
                width={width} height={topBarHeight} left={0} top={0}
            />
            <ComposeBottomToolbar
                onSubmit={handleSubmit}
                backgroundColor="white"
                width={width} height={bottomToolbarHeight} left={0} top={height - bottomToolbarHeight}
            />
        </div>
    )
}

export default ComposePopup
import { FunctionComponent, useState } from "react"
import JobsTable from "./JobsTable"
import JobView from "./JobView"

type Props = {
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
}

type Mode = 'jobs' | 'job'

const ContentWindow: FunctionComponent<Props> = ({left, top, width, height, backgroundColor}) => {
    const [mode, setMode] = useState<Mode>('jobs')
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor}}>
            {
                mode === 'jobs' ? (
                    <JobsTable width={width} height={height} />
                ) : mode === 'job' ? (
                    <JobView width={width} height={height} />
                ) : <span />
            }
        </div>
    )
}

export default ContentWindow
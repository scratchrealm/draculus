import { FunctionComponent } from "react"
import ComposeBottomToolbar from "./ComposeBottomToolbar"
import ComposeTopBar from "./ComposeTopBar"

type Props = {
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
    onClose: () => void
}

const bottomToolbarHeight = 60
const topBarHeight = 40

const ComposePopup: FunctionComponent<Props> = ({left, top, width, height, backgroundColor, onClose}) => {
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor}}>
            <ComposeTopBar
                onClose={onClose}
                title="Create new job"
                backgroundColor="black"
                width={width} height={topBarHeight} left={0} top={0}
            />
            <ComposeBottomToolbar
                backgroundColor="white"
                width={width} height={bottomToolbarHeight} left={0} top={height - bottomToolbarHeight}
            />
        </div>
    )
}

export default ComposePopup
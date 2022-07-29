import { FunctionComponent } from "react"
import ComposeTopBar from "./ComposeTopBar"
import { useFunctions } from "./FunctionsContext"
import Markdown from "./Markdown/Markdown"

type Props = {
    onClose: () => void
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
}

const topBarHeight = 40

const FunctionsHelpPopup: FunctionComponent<Props> = ({onClose, left, top, width, height, backgroundColor}) => {
    const {markdown} = useFunctions()
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor, border: 'solid 1px black'}}>
            <ComposeTopBar
                onClose={onClose}
                title="Functions help"
                backgroundColor="black"
                width={width} height={topBarHeight} left={0} top={0}
            />
            <div style={{left: 0, top: topBarHeight, width: width - 30, height: height - topBarHeight - 30, position: 'absolute', padding: 15}}>
                <Markdown
                    source={markdown || ''}
                    linkTarget="_blank"
                />
            </div>
        </div>
    )
}

export default FunctionsHelpPopup
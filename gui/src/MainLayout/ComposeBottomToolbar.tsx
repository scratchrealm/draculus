import { Button } from "@material-ui/core"
import { FunctionComponent } from "react"

type Props = {
    onSubmit: () => void
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
    okayToSubmit: boolean
}

const ComposeBottomToolbar: FunctionComponent<Props> = ({onSubmit, left, top, width, height, backgroundColor, okayToSubmit}) => {
    const submitBackgroundColor = okayToSubmit ? 'blue' : 'lightgray'
    const submitColor = okayToSubmit ? 'white' : 'black'
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor}}>
            <div style={{position: 'absolute', left: 10, top: 10}}>
                <Button onClick={onSubmit} variant="contained" disabled={!okayToSubmit} style={{backgroundColor: submitBackgroundColor, color: submitColor}}>Submit</Button>
            </div>
        </div>
    )
}

export default ComposeBottomToolbar
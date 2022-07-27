import { Button } from "@material-ui/core"
import { FunctionComponent } from "react"

type Props = {
    onSubmit: () => void
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
}

const ComposeBottomToolbar: FunctionComponent<Props> = ({onSubmit, left, top, width, height, backgroundColor}) => {
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor}}>
            <div style={{position: 'absolute', left: 10, top: 10}}>
                <Button onClick={onSubmit} variant="contained" style={{backgroundColor: 'blue', color: 'white'}}>Submit</Button>
            </div>
        </div>
    )
}

export default ComposeBottomToolbar
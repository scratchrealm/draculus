import { Button } from "@material-ui/core"
import { Edit } from "@material-ui/icons"
import { FunctionComponent } from "react"

type Props = {
    onCompose: () => void
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
}

const LeftPanel: FunctionComponent<Props> = ({onCompose, left, top, width, height, backgroundColor}) => {
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor, borderTop: 'solid 1px gray'}}>
            <div style={{paddingLeft: 10, paddingTop: 10}}>
                <Button variant="contained" onClick={onCompose}><Edit />&nbsp;&nbsp;Create job</Button>
            </div>
        </div>
    )
}

export default LeftPanel
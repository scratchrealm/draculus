import { IconButton } from "@material-ui/core"
import { Close } from "@material-ui/icons"
import { FunctionComponent } from "react"

type Props = {
    title: string
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
    onClose: () => void
}

const style: React.CSSProperties = {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing:0.2
}

const ComposeTopBar: FunctionComponent<Props> = ({title, left, top, width, height, backgroundColor, onClose}) => {
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor, ...style}}>
            <div style={{position: 'absolute', height, paddingTop: height / 2 - 9, paddingLeft: 10}}>
                {title}
            </div>
            <div style={{position: 'absolute', left: width - 50, width: 20, top: -2, height}}>
                <IconButton onClick={onClose} style={{color: 'white'}}>
                    <Close />
                </IconButton>
            </div>
        </div>
    )
}

export default ComposeTopBar
import { FunctionComponent } from "react"

type Props = {
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
}

const TopToolbar: FunctionComponent<Props> = ({left, top, width, height, backgroundColor}) => {
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor}}>
        </div>
    )
}

export default TopToolbar
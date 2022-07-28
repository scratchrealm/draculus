import { FunctionComponent } from "react"
import draculusLogo from '../draculus.png'

type Props = {
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
}

const AppBar: FunctionComponent<Props> = ({left, top, width, height, backgroundColor}) => {
    return (
        <div style={{left, top, width, height, position: "absolute", backgroundColor}}>
            <img src={draculusLogo} alt="draculus" height="40px" style={{paddingTop: 12, paddingLeft: 20}} />
        </div>
    )
}

export default AppBar
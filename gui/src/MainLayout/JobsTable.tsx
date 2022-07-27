import { FunctionComponent } from "react"

type Props = {
    width: number
    height: number
}

const JobsTable: FunctionComponent<Props> = ({width, height}) => {
    return (
        <div style={{width, height, position: "absolute", overflowY: "auto"}}>
            
        </div>
    )
}

export default JobsTable
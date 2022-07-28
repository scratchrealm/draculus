import { AccessTime, CheckBox, Close, Settings } from "@material-ui/icons";
import { FunctionComponent } from "react";
import { JobStatus } from "./Job";

type Props = {
    status: JobStatus
}

const s = {paddingTop: 5}

const StatusIcon: FunctionComponent<Props> = ({status}) => {
    return (
        <span title={status}>
            {
                status === 'waiting' ? (
                    <AccessTime style={{...s, color: 'blue'}} />
                ) : status === 'started' ? (
                    <Settings style={{...s, color: 'orange'}} />
                ) : status === 'finished' ? (
                    <CheckBox style={{...s, color: 'green'}} />
                ) : status === 'error' ? (
                    <Close style={{...s, color: 'red'}} />
                ) : <span>Unexpected</span>
            }
        </span>
    )
}

export default StatusIcon
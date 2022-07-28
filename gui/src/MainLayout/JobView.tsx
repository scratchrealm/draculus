import { Button, Table, TableBody, TableCell, TableRow } from "@material-ui/core"
import axios from 'axios'
import deserializeReturnValue from "figurl/deserializeReturnValue"
import { FunctionComponent, useCallback, useEffect, useState } from "react"
import Job from "./Job"
import { useJobs } from "./JobsContext"
import OutputDisplay from "./OutputDisplay"
import StatusIcon from "./StatusIcon"

type Props = {
    job: Job
    left: number
    top: number
    width: number
    height: number
}

const JobView: FunctionComponent<Props> = ({job, left, top, width, height}) => {
    const {setJobStatus} = useJobs()
    const [returnValue, setReturnValue] = useState<any | undefined>(undefined)
    const [checkingForOutput, setCheckingForOutput] = useState<boolean>(false)
    const checkForJobOutput = useCallback(() => {
        setCheckingForOutput(true)
        ;(async () => {
            if (!job.returnValueUrl) return
            const resp = await axios.get(job.returnValueUrl)
            if (resp.status !== 200) {
                if (job.status === 'finished') {
                    console.warn(`Problem loading output for finished job: ${job.returnValueUrl}`)
                }
                return
            }
            let returnValue
            try {
                returnValue = await deserializeReturnValue(resp.data)
            }
            catch(err) {
                console.warn(resp.data)
                console.warn(`Problem deserializing return value: ${job.returnValueUrl}`)
                return
            }
            if (job.status !== 'finished') {
                setJobStatus(job.jobId, 'finished')
            }
            setReturnValue(returnValue)
        })().finally(() => {
            setCheckingForOutput(false)
        })
    }, [job.jobId, job.returnValueUrl, job.status, setJobStatus])
    useEffect(() => {
        ;(async () => {
            if (job.status === 'finished') {
                if (!job.returnValueUrl) {
                    throw Error('Unexpected: no returnValueUrl')
                }
                checkForJobOutput()
            }
        })()
    }, [job.returnValueUrl, job.status, checkForJobOutput])
    const width1 = 140
    return (
        <div style={{left, top, width, height, position: "absolute", overflowY: "auto"}}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell style={{width: width1, fontWeight: 'bold'}}>Job ID:</TableCell>
                        <TableCell>{job.jobId}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: width1, fontWeight: 'bold'}}>Function name:</TableCell>
                        <TableCell>{job.function.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: width1, fontWeight: 'bold'}}>Input arguments:</TableCell>
                        <TableCell>{JSON.stringify(job.inputArguments)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: width1, fontWeight: 'bold'}}>Status:</TableCell>
                        <TableCell>
                            <StatusIcon status={job.status} />&nbsp;&nbsp;
                            {job.status}&nbsp;
                            {((job.status === 'waiting') || (job.status === 'started')) && (
                                <Button title="Manual check whether the output exists" disabled={checkingForOutput} onClick={checkForJobOutput}>Check for output</Button>
                            )}
                            {(job.status === 'error') && (
                                <span style={{color: 'red'}}>{job.error}</span>
                            )}
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: width1, fontWeight: 'bold'}}>Folder:</TableCell>
                        <TableCell>{job.folder || 'Default'}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Button onClick={() => console.info(job)}>Print job to console</Button>
            <hr/ >
            {
                returnValue && (
                    <div>
                        <h3>Output</h3>
                        <OutputDisplay
                            drFunction={job.function}
                            output={returnValue}
                        />
                    </div>
                )
            }
        </div>
    )
}

export default JobView
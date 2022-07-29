import { Button, IconButton, Table, TableBody, TableCell, TableRow } from "@material-ui/core"
import { Adb, FileCopy } from "@material-ui/icons"
import axios from 'axios'
import deserializeReturnValue from "figurl/deserializeReturnValue"
import { getTask } from "figurl/initiateTask"
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
    onCreateNewJobBasedOnCurrent: () => void
}

const JobView: FunctionComponent<Props> = ({job, left, top, width, height, onCreateNewJobBasedOnCurrent}) => {
    const {setJobStatus, restartJob} = useJobs()
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
    let okayToRestart = false
    if (job.status === 'error') okayToRestart = true
    if ((job.status === 'waiting') || (job.status === 'started')) {
        // if there is no task, it means we have reloaded the page. we should be able to restart in this case
        if (!getTask(job.taskJobId || '')) okayToRestart = true
    }
    const width1 = 140
    return (
        <div style={{left, top, width, height, position: "absolute", overflowY: "auto"}}>
            <hr/ >
            <Table className="Table3">
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
                            {okayToRestart && (
                                <Button title="Manual restart the job" disabled={false} onClick={() => restartJob(job)}>Restart job</Button>
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
                    <TableRow>
                        <TableCell style={{width: width1, fontWeight: 'bold'}}>Created:</TableCell>
                        <TableCell>{formatTimestamp(job.timestampCreated)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{width: width1, fontWeight: 'bold'}}>Project ID:</TableCell>
                        <TableCell>{job.function.projectId}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <IconButton onClick={onCreateNewJobBasedOnCurrent} title="Create a new job based on this one"><FileCopy /></IconButton>
            <IconButton onClick={() => console.info(job)} title="Print job to browser dev console"><Adb /></IconButton>            
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

const formatTimestamp = (timestamp: number) => {
    const d = new Date(timestamp)
    const a = d.toLocaleDateString('en-US')
    const b = d.toLocaleTimeString('en-US')
    return `${a} ${b}`
}

export default JobView
import { Button, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { Task } from 'figurl';
import randomAlphaString from 'figurl/util/randomAlphaString';
import { TaskJobStatus } from 'figurl/viewInterface/MessageToChildTypes';
import { FunctionComponent, useCallback, useEffect, useReducer, useState } from 'react';
import { DraculusData, DrFunction, DrFunctionParameter } from './DraculusData';
import DrFunctionJob from './DrFunctionJob';
import FunctionSelectControl from './FunctionSelectControl';
import JobWidget from './JobWidget';
import ParameterInput from './ParameterInput';
import './Table.css'

type Props = {
    data: DraculusData & {type: 'Draculus'}
    width: number
    height: number
}

type ParameterValuesAction = {
    type: 'setParameterValue',
    parameter: DrFunctionParameter,
    value: any
}

const parameterValuesReducer = (s: {[name: string]: any}, a: ParameterValuesAction) => {
    if (a.type === 'setParameterValue') {
        return {
            ...s,
            [a.parameter.name]: a.value
        }
    }
    else return s
}

const MainComponent: FunctionComponent<Props> = ({data}) => {
    const {functions} = data
    const [selectedFunction, setSelectedFunction] = useState<DrFunction | undefined>()
    const [job, setJob] = useState<DrFunctionJob | undefined>(undefined)
    const [taskStatus, setTaskStatus] = useState<TaskJobStatus | undefined>(undefined)
    useEffect(() => {
        if ((selectedFunction === undefined) && (functions.length > 0)) {
            setSelectedFunction(functions[0])
        }
    }, [selectedFunction, functions])
    const [parameterValues, parameterValuesDispatch] = useReducer(parameterValuesReducer, {})
    const handleParameterValueChange = useCallback((p: DrFunctionParameter, value: any) => {
        parameterValuesDispatch({
            type: 'setParameterValue',
            parameter: p,
            value
        })
    }, [])
    const handleRun = useCallback(() => {
        if (!selectedFunction) return
        setJob({
            jobId: randomAlphaString(10),
            function: selectedFunction,
            parameterValues
        })
    }, [selectedFunction, parameterValues])
    const handleTaskStatusChange = useCallback((job0: DrFunctionJob, task: Task<any> | undefined, taskStatus: TaskJobStatus | undefined) => {
        if (job0.jobId !== job?.jobId) return
        setTaskStatus(taskStatus)
    }, [job])
    const runJobEnabled = (job === undefined) || (taskStatus === 'finished') || (taskStatus === 'error')
    return (
        <div style={{margin: 20}}>
            <h3>Draculus</h3>
            <div>
                Select a function: <FunctionSelectControl functions={functions} selectedFunction={selectedFunction} onChange={setSelectedFunction} />
            </div>
            <div>&nbsp;</div><hr /><div>&nbsp;</div>
            {
                selectedFunction && (
                    <div style={{maxWidth: 300}}>
                        <Table className="Table1"><TableBody>
                            <TableRow key="<name>">
                                <TableCell>Function name</TableCell>
                                <TableCell>{selectedFunction.name}</TableCell>
                            </TableRow>
                            {
                                selectedFunction.parameters.map(p => (
                                    <TableRow key={p.name}>
                                        <TableCell>{p.name}</TableCell>
                                        <TableCell>
                                            <ParameterInput parameter={p} value={parameterValues[p.name]} onChange={handleParameterValueChange} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody></Table>
                    </div>
                )
            }
            <div>&nbsp;</div><hr /><div>&nbsp;</div>
            <Button onClick={handleRun} disabled={!runJobEnabled}>Run function</Button>
            <div>&nbsp;</div><hr /><div>&nbsp;</div>
            {
                job && (
                    <JobWidget
                        job={job}
                        onTaskStatusChange={handleTaskStatusChange}
                        onCancel={() => {setJob(undefined)}}
                    />
                )
            }
        </div>
    )
}

export default MainComponent
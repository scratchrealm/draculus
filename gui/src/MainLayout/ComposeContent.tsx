import { Table, TableBody, TableCell, TableRow } from "@material-ui/core"
import randomAlphaString from "figurl/util/randomAlphaString"
import { DrFunction, DrFunctionParameter } from "MainComponent/DraculusData"
import FunctionSelectControl from "MainComponent/FunctionSelectControl"
import ParameterInput from "MainComponent/ParameterInput"
import { FunctionComponent, useCallback, useEffect, useReducer, useState } from "react"
import { useFunctions } from "./FunctionsContext"
import Job from "./Job"
import { useJobs } from "./JobsContext"

type Props = {
    left: number
    top: number
    width: number
    height: number
    setNewJob: (job: Job | undefined) => void
}

type ParameterValuesAction = {
    type: 'setParameterValue',
    parameter: DrFunctionParameter,
    value: any
} | {
    type: 'setParameterValues',
    parameterValues: {[name: string]: any}
}

const parameterValuesReducer = (s: {[name: string]: any}, a: ParameterValuesAction) => {
    if (a.type === 'setParameterValue') {
        return {
            ...s,
            [a.parameter.name]: a.value
        }
    }
    else if (a.type === 'setParameterValues') {
        return a.parameterValues
    }
    else return s
}

const ComposeContent: FunctionComponent<Props> = ({left, top, width, height, setNewJob}) => {
    const {currentJob} = useJobs()
    const [selectedFunction, setSelectedFunction] = useState<DrFunction | undefined>()
    const {functions} = useFunctions()
    const [parameterValues, parameterValuesDispatch] = useReducer(parameterValuesReducer, {})
    const margin = 5
    const handleParameterValueChange = useCallback((p: DrFunctionParameter, value: any) => {
        parameterValuesDispatch({
            type: 'setParameterValue',
            parameter: p,
            value
        })
    }, [])
    useEffect(() => {
        // important to reset when new function is selected!
        parameterValuesDispatch({type: 'setParameterValues', parameterValues: {}})
    }, [selectedFunction])
    useEffect(() => {
        if (currentJob !== undefined) {
            setSelectedFunction(currentJob.function)
            parameterValuesDispatch({type: 'setParameterValues', parameterValues: currentJob.inputArguments})
        }
    }, [currentJob])
    useEffect(() => {
        if (!selectedFunction) {
            setNewJob(undefined)
            return
        }
        for (let p of selectedFunction.parameters) {
            if (parameterValues[p.name] === undefined) {
                setNewJob(undefined)
                return
            }
        }
        const job: Job = {
            jobId: randomAlphaString(10),
            function: {...selectedFunction},
            inputArguments: parameterValues,
            status: 'waiting',
            timestampCreated: Date.now()
        }
        setNewJob(job)
    }, [parameterValues, selectedFunction, setNewJob])
    return (
        <div style={{left: left + margin, top: top + margin, width: width - margin * 2, height: height - margin * 2, position: "absolute", overflowY: 'auto'}}>
            Select function:
            <FunctionSelectControl
                functions={functions || []}
                selectedFunction={selectedFunction}
                onChange={setSelectedFunction}
            />
            <div>&nbsp;</div><hr />
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
        </div>
    )
}

export default ComposeContent
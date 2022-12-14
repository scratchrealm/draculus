import { Button, Table, TableBody, TableCell, TableRow } from "@material-ui/core"
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
    onHelp: () => void
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

const ComposeContent: FunctionComponent<Props> = ({left, top, width, height, setNewJob, onHelp}) => {
    const {currentJob} = useJobs()
    const [selectedFunction, setSelectedFunction] = useState<DrFunction | undefined>()
    const {functions, markdown} = useFunctions()
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
        // select first function (or use the function for the current job)
        if (selectedFunction === undefined) {
            if (currentJob !== undefined) {
                const f = (functions || []).filter(f => (f.name === currentJob.function.name))[0]
                if (f) {
                    setSelectedFunction(f)
                    return
                }
            }
            if ((functions?.length || 0) > 0) {
                setSelectedFunction((functions || [])[0])
            }
        }
    }, [selectedFunction, functions, currentJob])
    useEffect(() => {
        if (!selectedFunction) return
        // Reset the parameters to default when new function is selected (or use current job parameters)
        const initialArguments: {[name: string]: any} = {}
        for (let p of selectedFunction.parameters) {
            if (currentJob && (currentJob.function.name === selectedFunction.name)) {
                if (currentJob.inputArguments[p.name] !== undefined) {
                    initialArguments[p.name] = currentJob.inputArguments[p.name]
                }
            }
            else {
                if (p.default !== undefined) {
                    initialArguments[p.name] = p.default
                }
            }
        }
        parameterValuesDispatch({type: 'setParameterValues', parameterValues: initialArguments})
    }, [selectedFunction, currentJob])
    useEffect(() => {
        // Set the new job, but only if a function is selected and all the parameters are valid
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
            {
                markdown && (
                    <Button onClick={onHelp}>Show help</Button>
                )
            }
            <div>
                Select function:
                <FunctionSelectControl
                    functions={functions || []}
                    selectedFunction={selectedFunction}
                    onChange={setSelectedFunction}
                />
            </div>
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
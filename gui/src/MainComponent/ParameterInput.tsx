import { Check, Close } from "@material-ui/icons";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { DrFunctionParameter } from "./DraculusData";

type Props = {
    parameter: DrFunctionParameter
    value: any
    onChange: (parameter: DrFunctionParameter, value: any) => void
}

const ParameterInput: FunctionComponent<Props> = ({parameter, value, onChange}) => {
    const [internalValue, setInternalValue] = useState<any | undefined>(undefined)
    useEffect(() => {
        setInternalValue(value)
    }, [value])
    const handleChange = useCallback((event: any) => {
        const newValue = event.target.value
        setInternalValue(newValue)
    }, [])
    const [okay, setOkay] = useState<boolean>(false)

    useEffect(() => {
        if (internalValue === undefined) return
        console.log('---- testa', internalValue, parameter.dtype)
        let val: any
        try {
            console.log('---- testb', internalValue)
            if (parameter.dtype === 'float') {
                val = parseFloat(internalValue)
                if (isNaN(val)) {
                    onChange(parameter, undefined)
                    setOkay(false)
                    return
                }
            }
            else if (parameter.dtype === 'int') {
                val = parseInt(internalValue)
                if (isNaN(val)) {
                    onChange(parameter, undefined)
                    setOkay(false)
                    return
                }
            }
            else if (parameter.dtype === 'str') {
                console.log('---- testc', internalValue)
                val = internalValue
            }
            else {
                throw Error('Unexpected parameter.dtype')
            }
        }
        catch(err) {
            console.warn('Problem with parameter', err)
            onChange(parameter, undefined)
            setOkay(false)
            return
        }
        console.log('---- onchange', internalValue, val)
        onChange(parameter, val)
        setOkay(true)
    }, [internalValue, parameter, onChange])

    if ((parameter.dtype === 'float') || (parameter.dtype === 'int') || (parameter.dtype === 'str')) {
        return (
            <div>
                <div style={{float: 'left'}}>
                    <input type="text" value={internalValue} style={{width: 100}} onChange={handleChange} />
                </div>
                <div style={{float: 'right'}}>
                    {
                        okay ? <Check style={{color: 'green'}} /> : <Close style={{color: 'red'}} />
                    }
                </div>
            </div>
        )
    }
    else return <div>Unexpected parameter dtype: {parameter.dtype}</div>

}

export default ParameterInput
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
        let val: number
        try {
            val = parseFloat(internalValue)
        }
        catch(err) {
            onChange(parameter, undefined)
            setOkay(false)
            return
        }
        if (isNaN(val)) {
            onChange(parameter, undefined)
            setOkay(false)
            return
        }
        onChange(parameter, val)
        setOkay(true)
    }, [internalValue, parameter, onChange])

    if (parameter.dtype === 'float') {
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
import { MenuItem, Select } from "@material-ui/core"
import { FunctionComponent, useCallback } from "react"
import { DrFunction } from "./DraculusData"

type Props = {
    functions: DrFunction[]
    selectedFunction?: DrFunction
    onChange: (f: DrFunction) => void
}

const FunctionSelectControl: FunctionComponent<Props> = ({functions, selectedFunction, onChange}) => {
    const handleChange = useCallback((e: React.ChangeEvent<{name?: string | undefined, value: unknown}>) => {
        const name = e.target.value
        const a = functions.filter(f => (f.name === name))[0]
        if (!a) return
        onChange(a)
    }, [onChange, functions])
    return (
        <div>
            <Select
                value={selectedFunction?.name || '<none>'}
                onChange={handleChange}
            >
                <MenuItem key='<none>' value="<none>">Select a function</MenuItem>
                {
                    functions.map(f => (
                        <MenuItem key={f.name} value={f.name}>{f.name}</MenuItem>
                    ))
                }
            </Select>
        </div>
    )
}

export default FunctionSelectControl
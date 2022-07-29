import { IconButton } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { FunctionComponent, useCallback, useState } from "react";

type Props = {
    setSearchString: (x: string) => void
    width: number
    height: number
}

const SearchBar: FunctionComponent<Props> = ({setSearchString, width, height}) => {
    const [internalValue, setInternalValue] = useState<string>('')
    const [lastValue, setLastValue] = useState<string>('')
    const handleSearch = useCallback(() => {
        setSearchString(internalValue)
        setLastValue(internalValue)
    }, [setSearchString, internalValue])
    const handleChange = useCallback((event: any) => {
        const newValue = event.target.value
        setInternalValue(newValue)
        if (!newValue) {
            // because it's the right thing to do
            setSearchString(newValue)
            setLastValue(newValue)
        }
    }, [setSearchString, setLastValue])
    return (
        <div>
            <div style={{width: 50, top: 10, height: height - 20, position: 'absolute', background: 'white', border: 'none'}}>
            </div>
            <div style={{width: 50, top: 7, height: height - 20, position: 'absolute'}}>
                <IconButton onClick={handleSearch}><Search style={{width: 30, height: 30}} /></IconButton>
            </div>
            <div style={{left: 50, top: 10, width: width - 50, height: height - 20, position: 'absolute'}}>
                <input
                    style={{outline: 'none', height: height - 22, border: 'none', fontSize: 20, color: internalValue === lastValue ? 'green' : undefined}}
                    type="text"
                    value={internalValue}
                    onChange={handleChange}
                    onKeyDown={e => {if (e.key === 'Enter') handleSearch()}}
                />
            </div>
        </div>
    )
}

export default SearchBar
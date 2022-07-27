import { FunctionComponent } from "react";

type Props = {
    array: any[]
}

const NdArrayDisplay: FunctionComponent<Props> = ({array}) => {
    if (array.length === 0) return <span>{`[]`}</span>

    if (typeof(array[0]) === 'number') {
        const outputString = getOutputString1D(array)
        return <span>[{outputString}]</span>
    }
    else if (typeof(array[0][0]) === 'number') {
        const x: string[] = []
        for (let i = 0; i < array.length; i++) {
            x.push('[' + getOutputString1D(array[i]) + ']')
        }
        let out: string
        if (x.length > 10) {
            out = x.slice(0, 11).join(', ') + ', ...'
        }
        else {
            out = x.join(', ')
        }
        return <span>[{out}]</span>
    }
    else {
        return <span>Number of dimensions not supported in NdArrayDisplay</span>
    }
}

const getOutputString1D = (array: number[]) => {
    let outputString: string = array.join(', ')
    if (outputString.length > 150) {
        outputString = outputString.slice(0, 151)
        const ind = outputString.lastIndexOf(',')
        if (ind >= 0) outputString = outputString.slice(0, ind)
        outputString += ', ...'
    }
    return outputString
}

export default NdArrayDisplay
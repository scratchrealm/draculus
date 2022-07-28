import { FunctionComponent } from "react";
import { DrFunction } from "../MainComponent/DraculusData";
import Markdown from "./Markdown/Markdown";
import NdArrayDisplay from "../MainComponent/NdArrayDisplay";

type Props = {
    output: any
    drFunction: DrFunction
}

const OutputDisplay: FunctionComponent<Props> = ({output, drFunction}) => {
    if (output === undefined) {
        return <span>Output is undefined</span>
    }
    if ((drFunction.output.dtype === 'float') || (drFunction.output.dtype === 'int') || (drFunction.output.dtype === 'string')) {
        return <span>{output}</span>
    }
    else if (drFunction.output.dtype === 'ndarray') {
        return <NdArrayDisplay array={output} />
    }
    else if (drFunction.output.dtype === 'markdown') {
        return <Markdown source={output} linkTarget="_blank" />
    }
    else {
        return <span>Unexpected output type: {drFunction.output.dtype}</span>
    }
}

export default OutputDisplay
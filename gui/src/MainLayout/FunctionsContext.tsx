import { DraculusData, DrFunction } from "MainComponent/DraculusData"
import React, { FunctionComponent, PropsWithChildren, useContext, useMemo } from "react"

type FunctionsState = {
    functions?: DrFunction[]
    markdown?: string
}

const FunctionsContext = React.createContext<{
    functionsState: FunctionsState
}>({functionsState: {}})

export const useFunctions = () => {
    const c = useContext(FunctionsContext)
    const {functionsState} = c

    return {
        functions: functionsState.functions,
        markdown: functionsState.markdown
    }
}

export const SetupFunctions: FunctionComponent<PropsWithChildren<{data: DraculusData}>> = (props) => {
    const value = useMemo(() => ({
        functionsState: {
            functions: props.data.functions,
            markdown: props.data.markdown
        }
    }), [props.data.functions, props.data.markdown])
    return (
        <FunctionsContext.Provider value={value}>
            {props.children}
        </FunctionsContext.Provider>
    )
}

export default FunctionsContext
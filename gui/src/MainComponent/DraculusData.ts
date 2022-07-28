import { validateObject } from '../figurl';
import { isArrayOf, isEqualTo, isString } from '../figurl/viewInterface/validateObject';

export type DrFunctionParameter = {
    name: string
    dtype: string
}

export type DrFunctionOutput = {
    dtype: string
}

export type DrFunction = {
    name: string
    parameters: DrFunctionParameter[]
    output: DrFunctionOutput
    projectId: string
}

export const isDrFunction = (x: any): x is DrFunction => {
    return validateObject(x, {
        name: isString,
        parameters: isArrayOf(z => (validateObject(z, {
            name: isString,
            dtype: isString
        }))),
        output: z => (validateObject(z, {
            dtype: isString
        })),
        projectId: isString
    })
}

export type DraculusData = {
    type: 'Draculus',
    functions: DrFunction[]
}
export const isDraculusData = (x: any): x is DraculusData => {
    return validateObject(x, {
        type: isEqualTo('Draculus'),
        functions: isArrayOf(isDrFunction)
    })
}
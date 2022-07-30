import Job, { isJob } from 'MainLayout/Job';
import { validateObject } from '../figurl';
import { isArrayOf, isEqualTo, isString, optional } from '../figurl/viewInterface/validateObject';

export type DrFunctionParameter = {
    name: string
    dtype: string
    default?: any
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
            dtype: isString,
            default: optional(() => (true))
        }))),
        output: z => (validateObject(z, {
            dtype: isString
        })),
        projectId: isString
    })
}

export type DraculusData = {
    type: 'Draculus'
    functions: DrFunction[]
    markdown?: string
} | {
    type: 'job'
    job: Job
}

export const isDraculusData = (x: any): x is DraculusData => {
    return validateObject(x, {
        type: isEqualTo('Draculus'),
        functions: isArrayOf(isDrFunction),
        markdown: optional(isString)
    }) || validateObject(x, {
        type: isEqualTo('job'),
        job: isJob
    })
}
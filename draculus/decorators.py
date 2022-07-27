import functools
from typing import List
from .Draculus import DrFunctionOutput, DrFunctionParameter


def function(name: str):
    def decorator(func):
        setattr(func, '_draculus_name', name)
        return func
    return decorator

def parameter(name: str, *, dtype: str):
    def decorator(func):
        parameters: List[DrFunctionParameter] = getattr(func, '_draculus_parameters', [])
        parameters.append(
            DrFunctionParameter(name=name, dtype=dtype)
        )
        setattr(func, '_draculus_parameters', parameters)
        return func
    return decorator

def output(*, dtype: str):
    def decorator(func):
        output = DrFunctionOutput(dtype=dtype)
        setattr(func, '_draculus_output', output)
        return func
    return decorator

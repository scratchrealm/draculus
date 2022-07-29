import functools
from typing import Any, List, Union
from .Draculus import DrFunctionOutput, DrFunctionParameter


def function(name: str):
    def decorator(func):
        setattr(func, '_draculus_name', name)
        return func
    return decorator

def parameter(name: str, *, dtype: str, default: Union[Any, None]=None):
    def decorator(func):
        parameters: List[DrFunctionParameter] = getattr(func, '_draculus_parameters', [])
        parameters.insert(
            0,
            DrFunctionParameter(name=name, dtype=dtype, default=default)
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

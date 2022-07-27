from typing import Callable, List, Union
import kachery_cloud as kcl
import figurl as fig
from kachery_cloud.TaskBackend import TaskBackend


class DrFunctionParameter:
    def __init__(self, *, name: str, dtype: str) -> None:
        self.name = name
        self.dtype = dtype
    def to_dict(self):
        return {
            'name': self.name,
            'dtype': self.dtype
        }

class DrFunctionOutput:
    def __init__(self, *, dtype: str) -> None:
        self.dtype = dtype
    def to_dict(self):
        return {
            'dtype': self.dtype
        }

class DrFunction:
    def __init__(self, f: Callable, *, name: str, parameters: List[DrFunctionParameter], output: DrFunctionOutput) -> None:
        self.f = f
        self.name = name
        self.parameters = parameters
        self.output = output
    def to_dict(self):
        return {
            'name': self.name,
            'parameters': [P.to_dict() for P in self.parameters],
            'output': self.output.to_dict()
        }

class Draculus:
    def __init__(self) -> None:
        self._functions: List[DrFunction] = []
    def add_function(self, f: Callable):
        name = getattr(f, '_draculus_name', None)
        parameters = getattr(f, '_draculus_parameters', None)
        output = getattr(f, '_draculus_output', None)
        assert name is not None
        assert parameters is not None
        assert output is not None
        self._functions.append(
            DrFunction(f=f, name=name, parameters=parameters, output=output)
        )
    def to_dict(self):
        return {
            'type': 'Draculus',
            'functions': [F.to_dict() for F in self._functions]
        }
    def start(self, *, label: str, project_id: Union[str, None]=None):
        if project_id is None:
            project_id = kcl.get_project_id()
        F = fig.Figure(
            view_url='gs://figurl/draculus-1',
            data=self.to_dict()
        )
        print('')
        print('======================================================')
        print(F.url(label=label, project_id=project_id))
        print('======================================================')
        print('')
        T = TaskBackend(project_id=project_id, num_workers=4, threads_per_worker=1)
        for func in self._functions:
            T.register_task_handler(task_type='calculation', task_name=func.name, task_function=func.f)
        T.run()

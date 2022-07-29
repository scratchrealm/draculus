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
    def __init__(self, f: Callable, *, name: str, parameters: List[DrFunctionParameter], output: DrFunctionOutput, project_id: str) -> None:
        self.f = f
        self.name = name
        self.parameters = parameters
        self.output = output
        self.project_id = project_id
    def to_dict(self):
        return {
            'name': self.name,
            'parameters': [P.to_dict() for P in self.parameters],
            'output': self.output.to_dict(),
            'projectId': self.project_id
        }

class Draculus:
    def __init__(self, *, markdown: Union[str, None], project_id: Union[str, None]=None) -> None:
        self._functions: List[DrFunction] = []
        if project_id is None:
            project_id = kcl.get_project_id()
        self._project_id = project_id
        self._markdown = markdown
    def add_function(self, f: Callable):
        name = getattr(f, '_draculus_name', None)
        parameters = getattr(f, '_draculus_parameters', None)
        output = getattr(f, '_draculus_output', None)
        assert name is not None
        assert parameters is not None
        assert output is not None
        self._functions.append(
            DrFunction(f=f, name=name, parameters=parameters, output=output, project_id=self._project_id)
        )
    def to_dict(self):
        ret = {
            'type': 'Draculus',
            'functions': [F.to_dict() for F in self._functions]
        }
        if self._markdown is not None:
            ret['markdown'] = self._markdown
        return ret
    def start(self, *, label: str, hide_app_bar: bool=False):
        data = self.to_dict()
        F = fig.Figure(
            view_url='gs://figurl/draculus-1',
            data=data
        )
        print('')
        print('======================================================')
        print(F.url(label=label, project_id=self._project_id, hide_app_bar=hide_app_bar)) # requires figurl>=0.2.8
        print('======================================================')
        print('')
        print('This is a live backend. Keep this running in a terminal. Tasks will run on this machine.')
        print('')
        T = TaskBackend(project_id=self._project_id, num_workers=4, threads_per_worker=1)
        for func in self._functions:
            T.register_task_handler(task_type='calculation', task_name=func.name, task_function=func.f)
        T.run()

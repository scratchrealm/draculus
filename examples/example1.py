# 7/27/22
# https://figurl.org/f?v=gs://figurl/draculus-1&d=sha1://42defb5566d5c999d82ab78f5fb697e808b90e9e&project=lqhzprbdrq&label=test

import numpy as np
import draculus as dr

@dr.function('test-sum-1')
@dr.parameter('x', dtype='float')
@dr.parameter('y', dtype='float')
@dr.output(dtype='float')
def test_sum(x: float, y: float):
    return x + y

@dr.function('test-array-1')
@dr.parameter('n', dtype='int')
@dr.output(dtype='ndarray')
def test_array(n: int):
    if n <= 0:
        raise Exception('n must be positive')
    if n > 10000:
        raise Exception('Too large')
    return np.arange(1, n + 1).astype(np.float32)

@dr.function('test-array-2d-2')
@dr.parameter('n', dtype='int')
@dr.output(dtype='ndarray')
def test_array_2d(n: int):
    if n <= 0:
        raise Exception('n must be positive')
    if n > 100:
        raise Exception('Too large')
    return np.tile(np.arange(1, n + 1).astype(np.float32), (5, 1))

@dr.function('test-markdown-1')
@dr.parameter('param1', dtype='str')
@dr.parameter('param2', dtype='str')
@dr.output(dtype='markdown')
def test_markdown(param1: str, param2: str):
    return f'''
# Example markdown output

* Here is the first input parameter: {param1}
* Here is the second input parameter: {param2}

```python
import numpy as np

# Here is a code snippet
```

> This is quoted text

## Example heading

Example text

[Example link to draculus repo](https://github.com/scratchrealm/draculus)
'''

if __name__ == '__main__':
    X = dr.Draculus()
    X.add_function(test_sum)
    X.add_function(test_array)
    X.add_function(test_array_2d)
    X.add_function(test_markdown)
    X.start(label='test')

    # This is a live backend
    # Keep this running in a terminal
    # Tasks will run on this machine
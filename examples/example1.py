# 7/27/22
# https://figurl.org/f?v=gs://figurl/draculus-1&d=sha1://9d03fa979bcf4938ea4d2ae7207785dd52136d19&project=lqhzprbdrq&label=test

import draculus as dr

@dr.function('test-1')
@dr.parameter('x', dtype='float')
@dr.parameter('y', dtype='float')
@dr.output(dtype='float')
def test1(x: float, y: float):
    return x + y

if __name__ == '__main__':
    X = dr.Draculus()
    X.add_function(test1)
    X.start(label='test')
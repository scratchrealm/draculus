import numpy as np
import draculus as dr
import sortingview as sv
import sortingview.views as vv
import spikeinterface.extractors as se
from sortingview_test_scripts.test_autocorrelograms import test_autocorrelograms
from sortingview_test_scripts.test_cross_correlograms import test_cross_correlograms
from sortingview_test_scripts.test_raster_plot import test_raster_plot
from sortingview_test_scripts.test_average_waveforms import test_average_waveforms
from sortingview_test_scripts.test_units_table import test_units_table
from sortingview_test_scripts.test_unit_similarity_matrix import test_unit_unit_similarity_matrix
from sortingview_test_scripts.test_spike_amplitudes import test_spike_amplitudes

@dr.function('sortingview-for-simulation-1')
@dr.parameter('num_units', default=12, dtype='int')
@dr.parameter('duration_sec', default=300, dtype='float')
@dr.output(dtype='markdown')
def sortingview_for_simulation(num_units: int, duration_sec: float):
    if num_units > 100:
        raise Exception('Exceeded maximum number of units')
    if duration_sec > 1000:
        raise Exception('Exceeded maximum duration')

    recording, sorting = se.toy_example(num_units=num_units, duration=duration_sec, seed=0)

    R = sv.copy_recording_extractor(recording, serialize_dtype='float32')
    S = sv.copy_sorting_extractor(sorting)

    v_units_table = test_units_table(recording=R, sorting=S)
    v_raster_plot = test_raster_plot(recording=R, sorting=S)
    v_autocorrelograms = test_autocorrelograms(sorting=S)
    v_average_waveforms = test_average_waveforms(recording=R, sorting=S)
    v_cross_correlograms = test_cross_correlograms(recording=R, sorting=S, hide_unit_selector=True)
    v_unit_similarity_matrix = test_unit_unit_similarity_matrix(recording=R, sorting=S)
    v_spike_amplitudes = test_spike_amplitudes(recording=R, sorting=S, hide_unit_selector=True)

    view = vv.Box(
        direction='vertical',
        items=[
            vv.LayoutItem(
                vv.Splitter(
                    direction='horizontal',
                    item1=vv.LayoutItem(v_units_table, min_size=100, stretch=1),
                    item2=vv.LayoutItem(
                        vv.Splitter(
                            direction='horizontal',
                            item1=vv.LayoutItem(vv.Splitter(
                                direction='vertical',
                                item1=vv.LayoutItem(v_raster_plot, stretch=3),
                                item2=vv.LayoutItem(v_spike_amplitudes, stretch=3)
                            )),
                            item2=vv.LayoutItem(v_unit_similarity_matrix, stretch=1)
                        ),
                        min_size=200, stretch=3
                    )
                )
            ),
            vv.LayoutItem(
                vv.Box(
                    direction='horizontal',
                    items=[
                        vv.LayoutItem(v_autocorrelograms, stretch=1),
                        vv.LayoutItem(v_average_waveforms, stretch=1),
                        vv.LayoutItem(v_cross_correlograms, stretch=1)
                    ]
                )
            )
        ]
    )

    url = view.url(label='test layout')
    return f'''
A simulated recording/sorting pair has been generated.

[Click here]({url}) to go to the SortingView visualization.
'''

if __name__ == '__main__':
    X = dr.Draculus(
        markdown='''
# sortingview-for-simulation

Parameters
* num_units - the number of true units to simulate
* duration_sec - the duration of the simulated recording
'''
    )
    X.add_function(sortingview_for_simulation)
    X.start(label='draculus sortingview example', hide_app_bar=True)

    # This is a live backend
    # Keep this running in a terminal
    # Tasks will run on this machine
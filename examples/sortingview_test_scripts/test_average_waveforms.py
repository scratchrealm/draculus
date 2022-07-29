# 7/15/22
# https://figurl.org/f?v=gs://figurl/spikesortingview-6&d=sha1://ec4be8f67fd8ff2a7a63dcd4c13e39993d84a0c8&label=test_average_waveforms

from typing import List, Tuple
import numpy as np
import sortingview as sv
import sortingview.views as vv
import spikeinterface as si
import spikeinterface.extractors as se


def main():
    recording, sorting = se.toy_example(num_units=12, duration=300, seed=0)

    R = sv.copy_recording_extractor(recording, serialize_dtype='float32')
    S = sv.copy_sorting_extractor(sorting)

    view = test_average_waveforms(recording=R, sorting=S)

    url = view.url(label='test_average_waveforms')
    print(url)

def test_average_waveforms(*, recording: si.BaseRecording, sorting: si.BaseSorting):
    # noise_level = estimate_noise_level(recording)
    average_waveform_items: List[vv.AverageWaveformItem] = []
    for unit_id in sorting.get_unit_ids():
        a = compute_average_waveform(recording=recording, sorting=sorting, unit_id=unit_id)
        channel_ids = a['channel_ids']
        waveform = a['waveform']
        average_waveform_items.append(
            vv.AverageWaveformItem(
                unit_id=unit_id,
                waveform=waveform.T,
                channel_ids=channel_ids
            )
        )
    channel_locations = {}
    for ii, channel_id in enumerate(recording.channel_ids):
        channel_locations[str(channel_id)] = recording.get_channel_locations()[ii, :].astype(np.float32)
    view = vv.AverageWaveforms(
        average_waveforms=average_waveform_items,
        channel_locations=channel_locations,
        show_reference_probe=True
    )
    return view

def extract_snippets(*, traces: np.ndarray, times: np.array, snippet_len: Tuple[int]):
    N = traces.shape[0]
    M = traces.shape[1]
    T = snippet_len[0] + snippet_len[1]
    ret = np.zeros((len(times), T, M), dtype=traces.dtype)
    if len(times) == 0:
        return ret
    for t in range(T):
        times2 = times + t - snippet_len[0]
        valid = np.where((0 <= times2) & (times2 < N))
        if len(valid) > 0:
            ret[valid, t, :] = traces[times2[valid], :]
    return ret

def compute_average_waveform(*, recording: si.BaseRecording, sorting: si.BaseSorting, unit_id: int):
    traces = recording.get_traces()
    times = sorting.get_unit_spike_train(unit_id=unit_id)
    snippets = extract_snippets(traces=traces, times=times, snippet_len=(20, 20))
    waveform = np.mean(snippets, axis=0)
    return {
        'channel_ids': recording.get_channel_ids().astype(np.int32),
        'waveform': waveform.astype(np.float32)
    }

# def estimate_noise_level(recording: si.BaseRecording):
#     traces0 = recording.get_traces(start_frame=0, end_frame=int(np.minimum(recording.get_num_frames(), recording.get_sampling_frequency() * 60))).T
#     est_noise_level = np.median(np.abs(traces0.ravel())) / 0.6745  # median absolute deviation (MAD) estimate of stdev
#     return est_noise_level

if __name__ == '__main__':
    main()
import librosa
import numpy as np
from scipy.fftpack.basic import fft
from scipy.signal.windows import hann


def detectFs(raw_time):  # seems to be completed
    """
    确定采样频率
    :param raw_time:
    :return:
    """
    fs_type = [4096, 8192, 16384, 32768, 65536, 22050, 44100, 48000]  # 用户数据采集时定义的采样频率
    fs_type = np.array(fs_type)
    fsd = len(raw_time) / raw_time[-1]
    fs = fs_type[abs(fs_type - fsd) < 1]
    if len(fs) == 1:
        return float(fs)
    else:
        return fsd


def rms(sig, window_size=None):
    fun = lambda a, size: np.sqrt(np.sum([a[size - i - 1:len(a) - i] ** 2 for i in range(size - 1)]) / size)
    if len(sig.shape) == 2:
        return np.array([rms(each, window_size) for each in sig])
    else:
        if not window_size:
            window_size = len(sig)
        return fun(sig, window_size)


def fft_average(raw_time, raw_data):
    spectrum_size = 16384
    fs = detectFs(raw_time)
    overlap = 50
    weighting = 1
    stepping = np.floor(spectrum_size * (100 - overlap) / 100)
    window_data = int((len(raw_time) - spectrum_size) // stepping + 1)
    pp = np.zeros((window_data, spectrum_size // 2 + 1))  # fft_vs_time
    n = spectrum_size  # Length for FFT
    wn = hann(n)  # 汉宁窗
    for i in range(window_data):
        x = raw_data[int(i * stepping):int(i * stepping + spectrum_size)]  # 获得分块数据'=
        xx = x * wn  # 分块数据加窗
        y = fft(xx)
        f = fs * np.arange(n // 2 + 1) / n  # 频域取FFT结果的前一半
        p = np.abs(y / n)  # FFT结果取模值
        p1 = p[:n // 2 + 1]  # FFT结果取前半部分
        p1[1: -1] *= 2  # FFT后半部分幅值叠加到前半部分
        p2 = 2 * p1  # 恢复窗函数幅值
        p2 = p2 * 2 ** -0.5  # peak to rms
        pp[i, 0:] = p2  # 生成所有分块数据的FFT矩阵
    pp_avr = rms(pp.transpose())  # 对分块数据求均方根
    db = 20 * np.log10(pp_avr / 2.0e-5)  # 将幅值转为声压级
    f = ""
    if weighting == 1:
        dba = db + librosa.A_weighting(f)
        return np.vstack([f, dba])
    else:
        return np.vstack([f, db])


raw_time = []
raw_data = []
f, db = fft_average(raw_time, raw_data)

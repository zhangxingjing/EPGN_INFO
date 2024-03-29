"""
未封装的算法文件
"""
import librosa
import numpy as np
import statsmodels.api as sm
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


def detectRpm(raw_rpm):
    """
    判定是一个rpm增序列还是降序列
    :param raw_rpm:
    :return:
    """
    if np.mean(raw_rpm[:2000]) - 2000 > np.mean(raw_rpm[-2000:]):
        rpmtype = 'rising'
    elif np.mean(raw_rpm[:2000]) + 2000 < np.mean(raw_rpm[-2000:]):
        rpmtype = 'falling'
    else:
        rpmtype = 'other'
    return rpmtype


def dataA(raw_time, raw_data):  # need to be improved
    fs = detectFs(raw_time)
    n = len(raw_time)
    if n % 2 == 0:
        f = fs * np.arange(n // 2) / n
        fa = librosa.A_weighting(f)
        temp1 = np.fft.fft(raw_data)
        # temp2 = 20*np.log10(temp1/2e-5)
        faf = 10 ** (fa / 20)  # *2e-5
        faf2 = faf[::-1]
        fafc = np.hstack((faf, faf2))
    else:
        f = fs * np.arange(n // 2 + 1) / n
        fa = librosa.A_weighting(f)
        temp1 = np.fft.fft(raw_data)
        # temp2 = 20*np.log10(temp1/2e-5)
        faf = 10 ** (fa / 20)  # *2e-5
        faf2 = faf[::-1]
        fafc = np.hstack((faf, faf2[1:]))
    temp3 = temp1 * fafc
    temp4 = np.fft.ifft(temp3)
    dataA = temp4.real
    return dataA


# def rpmSelect2(raw_time, raw_rpm):
#     rpmtype = detectRpm(raw_rpm)
#     if rpmtype == 'falling':
#         raw_rpm = raw_rpm[::-1]
#
#     fs = detectFs(raw_time)
#     r_min = np.min(raw_rpm)
#     r_max = np.max(raw_rpm)
#
#     rpm_step = 10
#     r_minp = np.argmin(raw_rpm)
#     r_maxp = np.argmax(raw_rpm)
#     s_time = raw_time[r_minp:r_maxp + 1]
#     s_rpm = raw_rpm[r_minp:r_maxp + 1]
#     rpm_ini = np.ceil(s_rpm[0] / rpm_step) * rpm_step
#     rpm_end = np.floor(s_rpm[-1] / rpm_step) * rpm_step
#
#     #    rpml = np.arange(rpm_ini,rfp = open("test.txt",w)    pm_end+rpm_step,rpm_step)
#     rpml = np.arange(rpm_ini, rpm_end + rpm_step, rpm_step)
#     # 截止到现在，转速取整，并且能保证取到最后一个数
#     rpmf = np.zeros(len(rpml))
#     for i in range(len(rpml)):
#         deltaR = 0.05
#         t01 = np.where((s_rpm > rpml[i] - deltaR) & (s_rpm < rpml[i] + deltaR))
#         # t02 = np.where(np.logical_and(np.greater(s_rpm,rs-deltaR),np.less(s_rpm,rs+deltaR)))
#         while np.size(t01, 1) == 0:
#             deltaR = deltaR + 0.05
#             t01 = np.where((s_rpm > rpml[i] - deltaR) & (s_rpm < rpml[i] + deltaR))
#         rpmf[i] = t01[0][0]
#     rpmf = rpmf + r_minp
#     if rpmtype == 'falling':
#         rpml = rpml[::-1]
#         t01 = len(raw_time) - rpmf
#         rpmf = t01[::-1]
#     return rpmf, rpml


def sum_db(raw_data, windowType='none'):
    data_recovery = 10 ** (raw_data / 20) * 2e-5
    if windowType == 'none':
        sum_db = 20 * np.log10(sum(data_recovery ** 2) ** 0.5 / 2e-5)
    elif windowType == 'hann':
        sum_db = 20 * np.log10(sum((data_recovery / 2 * 1.633) ** 2) ** 0.5 / 2e-5)
    return sum_db


# level 对 time
def level_time(raw_time, raw_data):
    timeWeighting = 0.125
    A = 1
    fs = detectFs(raw_time)
    if A == 1:
        raw_data = dataA(raw_time, raw_data)
    else:
        print("A!=1")
    timep1 = raw_time[:-1] - raw_time[-1]
    timep2 = raw_time[1:] + raw_time[-1]
    timep = np.hstack((timep1, raw_time, timep2))
    datap1 = raw_data[::-1]
    datap = np.hstack((datap1[:-1], raw_data, datap1[1:]))
    timepe = timep - timep[0]

    raw_e = np.exp(-timepe / timeWeighting)
    ff = np.fft.fft(datap ** 2) * np.fft.fft(raw_e)  # * fa
    ff2 = np.fft.ifft(ff)
    ff2r = ff2.real
    ff2rs = ff2r[len(raw_time) - 1:len(raw_time) * 2 - 1]
    pa = (ff2rs / fs / timeWeighting) ** 0.5
    lpa = 20 * np.log10(pa / 2e-5)
    # return np.vstack([raw_time, lpa])
    return raw_time, lpa


# level VS RPM
def level_rpm(raw_time, raw_data, raw_rpm):
    rpm_step = 5
    timeWeighting = 0.125  # fast&Slow的选择
    A = 1
    # plt.plot(raw_time,raw_rpm)
    # plt.show()
    rpmtype = detectRpm(raw_rpm)
    if rpmtype == 'falling':
        raw_rpm = raw_rpm[::-1]  # 倒序

    lpa = level_time(raw_time, raw_data)  # 调用level time算法

    (rpmf, rpml) = rpmSelect2(raw_time, raw_rpm)
    lpr = np.zeros(len(rpmf))
    for i in range(len(rpmf)):
        lpr[i] = lpa[int(rpmf[i])]
    return np.vstack([rpml, lpr])


# 二阶
def order_vfft(raw_time, raw_data, raw_rpm):
    rpm_step = 5
    rpmtype = detectRpm(raw_rpm)
    order = 2
    orderResolution = 0.5
    orderWidth = 0.5
    smoothFrac = 0.1
    fs = detectFs(raw_time)
    (rpmf, rpml) = rpmSelect2(raw_time, raw_rpm, rpm_step, rpmtype)
    dbo = np.zeros(np.size(rpml))
    for i in range(np.size(rpml)):
        fsResolution = rpml[i] / 60 * orderResolution
        blockSize = fs / fsResolution
        try:
            x = raw_data[int(rpmf[i] - blockSize // 2 + 1): int(rpmf[i] + blockSize // 2 + 1)]
            n = len(x)
            wn = hann(n)
            xx = x * wn
            y = fft(xx)
            f = fs * np.arange(n // 2 + 1) / n
            p = np.abs(y / n)
            p1 = p[:n // 2 + 1]
            p1[1: -1] *= 2
            p2 = 2 * p1
            p2 = p2 * 2 ** -0.5
            db = 20 * np.log10(p2 / 2e-5)
            fsCentre = rpml[i] / 60 * order
            fsFloor = rpml[i] / 60 * (order - orderWidth / 2)
            fsTop = rpml[i] / 60 * (order + orderWidth / 2)
            fsSelected = np.where((f > fsFloor) & (f < fsTop))
            if len(fsSelected[0]) == 1:
                dbo[i] = db[fsSelected[0][0]]
            else:
                dbs = db[fsSelected[0]]
                ppre = 10 ** (dbs / 20) * 2e-5
                pef = sum(ppre ** 2) ** 0.5
                dbo[i] = 20 * np.log10(pef / 2e-5)
        except:
            dbo[i] = dbo[i]
    for i in range(len(rpml)):
        t01 = np.where(dbo != 0)
    rpml = rpml[t01[0]]
    dbo = dbo[t01[0]]
    lowess = sm.nonparametric.lowess
    z = lowess(dbo, rpml, frac=smoothFrac)
    rpml = z[:, 0]
    dbo = z[:, 1]
    return np.vstack([rpml, dbo])


def rms(sig, window_size=None):
    fun = lambda a, size: np.sqrt(np.sum([a[size - i - 1:len(a) - i] ** 2 for i in range(size - 1)]) / size)
    if len(sig.shape) == 2:
        return np.array([rms(each, window_size) for each in sig])
    else:
        if not window_size:
            window_size = len(sig)
        return fun(sig, window_size)


# fft(滚动噪声RG --> 80～20)
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
    if weighting == 1:
        dba = db + librosa.A_weighting(f)
        '''A = vw.filterA(f)
        sampleNumUnderTen = int(np.ceil(10 / (fs / spectrum_size)))
        dba = db
        dba[:sampleNumUnderTen] = db[:sampleNumUnderTen] - 70.4
        dba[sampleNumUnderTen:] += 10 * np.log10(A[sampleNumUnderTen:])'''
        return np.vstack([f, dba])
    else:
        return np.vstack([f, db])


# 倍频程
def octave_fft(raw_time, raw_data):
    (fl, db) = fft_average(raw_time, raw_data)
    fb = np.array([22.5, 45, 90, 180, 355, 710, 1400, 2800, 5600, 11200])
    fc = np.array([31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000])
    ft = np.array([45, 90, 180, 355, 710, 1400, 2800, 5600, 11200, 22400])
    octave = np.array([])
    for i in range(len(fc)):
        fselected = np.where((fl > fb[i]) & (fl < ft[i]))
        octave_db = sum_db(db[fselected[0]])
        octave = np.hstack((octave, octave_db))
    return np.vstack([fc, octave])


"""
item = read_file_num('/home/zheng/Music/EPGN_DATA/B/BM7-324 Ausgang F3 VZ run01 ( 0.00-15.16 s).asc')
raw_time = item[:, 0]
raw_data = item[:, 1]
raw_rpm = item[:, 6]


# level_time
raw_time, lpa = level_time(raw_time, raw_data)
data_front = []
for a, b in zip(raw_time, lpa):
    data_front.append([a,b])
with open('FFT3.txt', 'a') as f:
    f.write(json.dumps({"asxdasd":data_front}))
"""
######################## 聂昂 ##############################
from numba import njit


@njit
def get_first_index(A, k, delta):
    for i in range(len(A)):
        if A[i] > k - delta and A[i] < k + delta:
            return i
    return -1


def rpmSelect2(raw_rpm, rpm_step, rpmtype='rising'):
    """
    :param raw_time:时间数据
    :param raw_rpm:转速数据
    :param rpm_step: 步长
    :param rpmtype:'falling'；
    :return: rpml: 从最低转速到最高转速的列表或从最高转速到最低转速的列表（步长为rpm_step）
             rpmf:对应raw_time中的采样点位置（相差不超过deltaR）
    """
    if rpmtype == 'falling':  # 如果是falling，将raw_rpm翻转
        raw_rpm = raw_rpm[::-1]
    r_minp = np.argmin(raw_rpm)  # raw_rpm最小值对应位置
    r_maxp = np.argmax(raw_rpm)  # raw_rpm最大值对应位置
    s_rpm = raw_rpm[r_minp:r_maxp + 1]
    rpm_ini = np.ceil(s_rpm[0] / rpm_step) * rpm_step  # rpm_ini：1110
    rpm_end = np.floor(s_rpm[-1] / rpm_step) * rpm_step  # rpm_end：5980
    rpml = np.arange(rpm_ini, rpm_end + rpm_step, rpm_step)  # rpml: 从最低转速到最高转速的列表（步长为rpm_step）
    rpmf = np.zeros(len(rpml))

    # 寻找rpml中每个转速对应的raw_time中的采样点位置（相差不超过deltaR）
    tag = 0
    for i in range(len(rpml)):
        deltaR = 0.05
        not_find = True
        while not_find:
            j = get_first_index(s_rpm, rpml[i], deltaR)
            if j != -1:
                not_find = False
                rpmf[i] = j
            else:
                deltaR = deltaR + 0.05
    rpmf = rpmf + r_minp
    if rpmtype == 'falling':
        rpml = rpml[::-1]
        t01 = len(raw_rpm) - rpmf
        rpmf = t01[::-1]
    return rpmf, rpml


"""class
    # def rpmSelect2(self):
    #     raw_rpm = self.raw_rpm
    #
    #     print(self.rpmtype, self.timeWeighting)
    #     if self.rpmtype == 'falling':
    #         raw_rpm = self.raw_rpm[::-1]
    #     # raw_rpm = self.raw_rpm[::-1]
    #     r_minp = np.argmin(raw_rpm)
    #     r_maxp = np.argmax(raw_rpm)
    #     s_rpm = raw_rpm[r_minp:r_maxp + 1]
    #     rpm_ini = np.ceil(s_rpm[0] / self.rpm_step) * self.rpm_step
    #     rpm_end = np.floor(s_rpm[-1] / self.rpm_step) * self.rpm_step
    #     rpml = np.arange(rpm_ini, rpm_end + self.rpm_step, self.rpm_step)
    #     rpmf = np.zeros(len(rpml))
    #     for i in range(len(rpml)):
    #         deltaR = 0.05
    #         t01 = np.where((s_rpm > rpml[i] - deltaR) & (s_rpm < rpml[i] + deltaR))
    #         while np.size(t01, 1) == 0:
    #             deltaR = deltaR + 0.05
    #             t01 = np.where((s_rpm > rpml[i] - deltaR) & (s_rpm < rpml[i] + deltaR))
    #         rpmf[i] = t01[0][0]
    #     rpmf = rpmf + r_minp
    #     if self.rpmtype == 'falling':
    #         rpml = rpml[::-1]
    #         t01 = len(self.raw_time) - rpmf
    #         rpmf = t01[::-1]
    #     return rpmf, rpml
"""

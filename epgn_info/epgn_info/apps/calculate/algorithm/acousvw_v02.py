import os
import time
import librosa
import numpy as np
import statsmodels.api as sm
from scipy.fftpack import fft
import matplotlib.pyplot as plt
from scipy.signal.windows import hann
from matplotlib.ticker import MaxNLocator
from mpl_toolkits.mplot3d import Axes3D  # noqa: F401 unused import
from matplotlib import cm

# from matplotlib.ticker import LinearLocator, FormatStrFormatter

absolute_dir = os.getcwd() + '/'


def readAscFile(file_path):  # head_content needs to be completed
    head_content = ""
    data_content = ""
    fileRead = open(file_path, 'r', encoding='gbk')
    while True:
        file_content = fileRead.readline()
        if not file_content:
            break
        if not file_content[0].isdigit():  # if begin with str
            head_content += file_content
        elif file_content[0].isdigit():  # if begin with num
            data_content += file_content
    content_line_list = data_content.split('\n')  # devide data_content by '\n'
    datas = []
    content_list = content_line_list[0].split(' ')
    if len(content_list) != 1:
        splitTag = ' '
    else:
        content_list = content_line_list[0].split('\t')
        if len(content_list) != 1:
            splitTag = '\t'
    for read_line in content_line_list:
        content_list = read_line.split(splitTag)
        items = []
        for contents in content_list:
            try:
                items.append(float(contents))
            except:
                continue
        datas.append(items)
    datas = datas[:-1]
    data_matrix = np.array(datas)
    return data_matrix


def detectFs(raw_time):  # seems to be completed
    fs_type = [4096, 8192, 16384, 32768, 65536, 22050, 44100, 48000]
    fs_type = np.array(fs_type)
    fsd = len(raw_time) / raw_time[-1]
    fs = fs_type[abs(fs_type - fsd) < 1]
    if len(fs) == 1:
        return float(fs)
    else:
        return fsd


def dataA(raw_time, raw_data):  # need to be improved
    fs = detectFs(raw_time)
    n = len(raw_time)
    f = fs * np.arange(n // 2) / n
    fa = librosa.A_weighting(f)

    temp1 = np.fft.fft(raw_data)
    # temp2 = 20*np.log10(temp1/2e-5)
    faf = 10 ** (fa / 20)  # *2e-5
    faf2 = faf[::-1]
    fafc = np.hstack((faf, faf2))

    temp3 = temp1 * fafc
    temp4 = np.fft.ifft(temp3)
    dataA = temp4.real
    return dataA


def rpmSelect2(raw_time, raw_rpm, rpm_step):
    fs = detectFs(raw_time)
    r_min = np.min(raw_rpm)
    r_max = np.max(raw_rpm)
    r_minp = np.argmin(raw_rpm)
    r_maxp = np.argmax(raw_rpm)
    s_time = raw_time[r_minp:r_maxp + 1]
    s_rpm = raw_rpm[r_minp:r_maxp + 1]
    rpm_ini = np.ceil(s_rpm[0] / rpm_step) * rpm_step
    rpm_end = np.floor(s_rpm[-1] / rpm_step) * rpm_step
    #    rpml = np.arange(rpm_ini,rfp = open("test.txt",w)    pm_end+rpm_step,rpm_step)
    rpml = np.arange(rpm_ini, rpm_end + rpm_step, rpm_step)
    rpmf = np.zeros(len(rpml))
    for i in range(len(rpml)):
        deltaR = 0.05
        t01 = np.where((s_rpm > rpml[i] - deltaR) & (s_rpm < rpml[i] + deltaR))
        # t02 = np.where(np.logical_and(np.greater(s_rpm,rs-deltaR),np.less(s_rpm,rs+deltaR)))
        while np.size(t01, 1) == 0:
            deltaR = deltaR + 0.05
            t01 = np.where((s_rpm > rpml[i] - deltaR) & (s_rpm < rpml[i] + deltaR))
        rpmf[i] = t01[0][0]
    rpmf = rpmf + r_minp
    return rpmf, rpml


def level_time(raw_time, raw_data, timeWeighting, A):
    fs = detectFs(raw_time)
    if A == 1:
        raw_data = dataA(raw_time, raw_data)

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
    return lpa


def level_rpm(raw_time, raw_data, raw_rpm, rpm_step, timeWeighting, A):
    lpa = level_time(raw_time, raw_data, timeWeighting, A)
    (rpmf, rpml) = rpmSelect2(raw_time, raw_rpm, rpm_step)
    lpr = np.zeros(len(rpmf))
    for i in range(len(rpmf)):
        lpr[i] = lpa[int(rpmf[i])]
    return rpml, lpr


def order_vfft(raw_time, raw_data, raw_rpm, rpm_step, order, orderResolution, orderWidth, smoothFrac):
    fs = detectFs(raw_time)
    (rpmf, rpml) = rpmSelect2(raw_time, raw_rpm, rpm_step)
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
    return rpml, dbo


def rms(sig, window_size=None):
    fun = lambda a, size: np.sqrt(np.sum([a[size - i - 1:len(a) - i] ** 2 for i in range(size - 1)]) / size)
    if len(sig.shape) == 2:
        return np.array([rms(each, window_size) for each in sig])
    else:
        if not window_size:
            window_size = len(sig)
        return fun(sig, window_size)


def fft_average(raw_data, spectrum_size, fs, weighting):
    window_data = len(raw_data) // (spectrum_size // 2) - 1  # 计算数据块数量
    pp = np.zeros((window_data, spectrum_size // 2 + 1))  # 预分配 fft_vs_time 矩阵
    for i in range(window_data):
        x = raw_data[int(i * spectrum_size / 2):int(i * spectrum_size / 2 + spectrum_size)]  # 获得分块数据'=
        n = spectrum_size  # Length for FFT
        wn = hann(n)  # 汉宁窗
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
        return f, dba
    else:
        return f, db


def fft_time(raw_time, raw_data, spectrum_size, fs, weighting):
    window_data = len(raw_data) // (spectrum_size // 2) - 1  # 计算数据块数量
    time_array = np.arange(raw_time[0], raw_time[0] + spectrum_size / 2 * (window_data), spectrum_size / 2) / fs
    pp = np.zeros((spectrum_size // 2 + 1, window_data))  # 预分配fft_vs_time 矩阵
    for i in range(window_data):
        x = raw_data[int(i * spectrum_size / 2):int(i * spectrum_size / 2 + spectrum_size)]  # 获得分块数据'=
        n = spectrum_size  # Length for FFT
        wn = hann(n)
        xx = x * wn
        y = fft(xx)
        f = fs * np.arange(n // 2 + 1) / n
        p = np.abs(y / n)
        p1 = p[:n // 2 + 1]
        p1[1: -1] *= 2
        p2 = 2 * p1  # recover from window functions
        p2 = p2 * 2 ** -0.5  # peak to rms
        pp[0:, i] = p2  # 生成所有分块数据的FFT矩阵
    pm = 20 * np.log10(pp / 2e-5)
    #    pm = pm.transpose()
    if weighting == 1:
        for i in range(window_data):
            pm[:, i] = pm[:, i] + librosa.A_weighting(f)
        return f, time_array, pm
    else:
        return f, time_array, pm


def fft_rpm(raw_time, raw_data, raw_rpm, rpm_step, spectrum_size, fs, weighting):
    (rpmf, rpml) = rpmSelect2(raw_time, raw_rpm, rpm_step)
    pp = np.zeros((spectrum_size // 2 + 1, len(rpml)))
    for i in range(len(rpml)):
        try:
            x = raw_data[int(rpmf[i] - spectrum_size / 2 + 1):int(rpmf[i] + spectrum_size / 2 + 1)]
            n = spectrum_size  # Length for FFT
            wn = hann(n)
            xx = x * wn
            y = fft(xx)
            f = fs * np.arange(n // 2 + 1) / n
            p = np.abs(y / n)
            p1 = p[:n // 2 + 1]
            p1[1: -1] *= 2
            p2 = 2 * p1  # recover from window functions
            p2 = p2 * 2 ** -0.5  # peak to rms
            pp[0:, i] = p2  # 生成所有分块数据的FFT矩阵
        except:
            pp[0:, i] = pp[0:, i]
    for i in range(len(rpml)):
        t01 = np.where(pp[0, :] != 0)
    rpml = rpml[t01[0]]
    pp = pp[:, t01[0]]
    pm = 20 * np.log10(pp / 2e-5)
    #    pm = pm.transpose()
    if weighting == 1:
        for i in range(len(rpml)):
            pm[:, i] = pm[:, i] + librosa.A_weighting(f)
        return f, rpml, pm
    else:
        return f, rpml, pm


def figure_inner(raw_time, raw_data, raw_rpm, rpm_step, order):
    rpm_step = 10
    timeWeighting = 0.125
    A = 1
    (rpml, lpr) = level_rpm(raw_time, raw_data, raw_rpm, rpm_step, timeWeighting, A)
    plt.figure()
    plt.plot(rpml, lpr)
    order = 2
    orderResolution = 0.5
    orderWidth = 0.5
    smoothFrac = 0.1  # default
    (rpml, dbo) = order_vfft(raw_time, raw_data, raw_rpm, rpm_step, order, orderResolution, orderWidth, smoothFrac)
    plt.plot(rpml, dbo)
    plt.xlabel('rpm')
    plt.ylabel('db')
    #    plt.title('2nd order')
    plt.grid(b=bool, which='both')
    plt.tight_layout()
    plt.legend(('level(A)', '2nd order'))
    plt.show()
    #    figurepath = 'f'+str(np.random.randint(100000,999999))
    figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
        np.random.randint(1000, 9999))
    plt.savefig(figurepath)
    plt.close()
    return figurepath


def figure_fft_average(raw_time, raw_data, spectrum_size, weighting):
    fs = detectFs(raw_time)
    (f, db) = fft_average(raw_data, spectrum_size, fs, weighting)
    plt.figure()
    plt.plot(f, db)
    plt.xscale('log')
    plt.xlim(10, 20000)
    #    plt.ylim(-20,90)
    plt.xlabel('fs/Hz')
    plt.ylabel('dB(A)')
    plt.grid(b=bool, which='both')
    plt.tight_layout()
    figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
        np.random.randint(1000, 9999))
    plt.savefig(figurepath)
    plt.close()
    return figurepath


def figure_fft_time(raw_time, raw_data, spectrum_size, weighting):
    fs = detectFs(raw_time)
    (f, ta, pm) = fft_time(raw_time, raw_data, 16384, fs, 1)
    # pm = pm.transpose()
    x2, y2 = np.meshgrid(ta, f)
    levels = MaxNLocator(nbins=50).tick_values(pm.min(), pm.max())
    fig, ax = plt.subplots()
    cf = ax.contourf(x2, y2, pm, levels=levels)
    ax.set_yscale('log')
    ax.set_ylim(20, 16000)
    fig.colorbar(cf, ax=ax)
    ax.set_title('contourf with levels')
    fig.tight_layout()
    plt.show()
    figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
        np.random.randint(1000, 9999))
    plt.savefig(figurepath)
    plt.close()
    return figurepath


def figure_fft_rpm(raw_time, raw_data, raw_rpm, rpm_step, spectrum_size, weighting):
    fs = detectFs(raw_time)
    rpm_step = 10
    spectrum_size = 16384
    fs = 44100
    weighting = 1
    (f, rpml, pm) = fft_rpm(raw_time, raw_data, raw_rpm, rpm_step, spectrum_size, fs, weighting)
    # pm = pm.transpose()
    x2, y2 = np.meshgrid(rpml, f)
    levels = MaxNLocator(nbins=50).tick_values(pm.min(), pm.max())
    levels = MaxNLocator(nbins=50).tick_values(10, 70)
    fig, ax = plt.subplots()
    cf = ax.contourf(x2, y2, pm, levels=levels)
    ax.set_yscale('log')
    ax.set_ylim(20, 16000)
    fig.colorbar(cf, ax=ax)
    ax.set_title('contourf with fft versus rpm')
    fig.tight_layout()
    plt.show()
    figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
        np.random.randint(1000, 9999))
    plt.savefig(figurepath)
    plt.close()
    return figurepath


def figure_order_vfft(raw_time, raw_data, raw_rpm, rpm_step, order, orderResolution, orderWidth, smoothFrac):
    fs = detectFs(raw_time)
    rpm_step = 10
    order = 2
    orderResolution = 0.5
    orderWidth = 0.5
    smoothFrac = 0.1  # default
    (rpml, dbo) = order_vfft(raw_time, raw_data, raw_rpm, rpm_step, fs, order, orderResolution, orderWidth, smoothFrac)
    plt.figure()
    plt.plot(rpml, dbo)
    plt.xlabel('rpm')
    plt.ylabel('db')
    plt.title('2nd order')
    plt.grid(b=bool, which='both')
    plt.tight_layout()
    plt.show()
    figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
        np.random.randint(1000, 9999))
    plt.savefig(figurepath)
    plt.close()
    return figurepath


def figure_level_time(raw_time, raw_data, timeWeighting, A):
    lpa = level_time(raw_time, raw_data, timeWeighting, A)
    plt.figure()
    plt.plot(raw_time, lpa)
    plt.grid('on')
    plt.xlabel('time/s')
    plt.ylabel('db')
    plt.title('level versus time')
    plt.tight_layout()
    plt.show()
    figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
        np.random.randint(1000, 9999))
    plt.savefig(figurepath)
    plt.close()
    return figurepath


def figure_level_rpm(raw_time, raw_data, raw_rpm, rpm_step, timeWeighting, A):
    (rpml, lpr) = level_rpm(raw_time, raw_data, raw_rpm, rpm_step, timeWeighting, A)
    plt.figure()
    plt.plot(rpml, lpr)
    plt.grid('on')
    plt.xlabel('rpm/s')
    plt.ylabel('db')
    plt.title('level versus rpm')
    plt.tight_layout()
    plt.show()
    figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
        np.random.randint(1000, 9999))
    plt.savefig(figurepath)
    plt.close()
    return figurepath


filepath = '700001 ( 0.00-14.80 s)with head.asc'
datam = readAscFile(filepath)
raw_time = datam[:, 0]
raw_data = datam[:, 1]
raw_rpm = datam[:, 5]
zz = figure_level_rpm(raw_time, raw_data, raw_rpm, 10, 1, 1)

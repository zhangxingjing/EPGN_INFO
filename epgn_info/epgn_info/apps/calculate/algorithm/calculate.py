# !/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2020/3/17 上午9:25
# @Author  : Zheng Xingtao
# @File    : calculate.py

import numpy as np
import librosa
import time
import os
import statsmodels.api as sm
import matplotlib.pyplot as plt
from scipy.signal.windows import hann
from numpy.fft.pocketfft import fft

from matplotlib.ticker import MaxNLocator

from readHDF import read_hdf

absolute_dir = os.getcwd() + '/'  # 获取文件绝对路径


def readAscFile(file_path):  # head_content needs to be completed
    '''
    :param file_path: 文件路径
    :return: data_matrix: 读取到的数据矩阵，第一列为时间数据，最后一列为转速数据，中间列为各通道声压级
    '''
    head_content = ""
    datas = []
    # 打开文件
    with open(file_path, 'r', encoding='gbk') as f:
        # 循环读取文件的每一行
        for file_content in f:
            if not file_content:  # 如果读到文件最后一行则跳出循环
                break
            if not file_content[0].isdigit():  # 如果读取到的是字符串
                head_content += file_content  # 则将字符串内容添加到head_content
            elif file_content[0].isdigit():  # 如果读取到的是数字
                file_content = file_content.split()  # 将改行按" "分割组成列表
                datas.append(file_content)  # 将读取到的数据存入datas
        data_matrix = np.array(datas, dtype=np.float64)  # 将列表转为np.array数据结构
    return data_matrix


def detectFs(raw_time):  # seems to be completed
    '''
    :param raw_time:时间数据
    :return: 数据的采样频率
    '''
    fs_type = [4096, 8192, 16384, 32768, 65536, 22050, 44100, 48000]  # 能识别的采样频率列表
    fs_type = np.array(fs_type)
    fsd = len(raw_time) / raw_time[-1]  # fsd = raw_time长度/时间 例：fsd = 44099.98631
    fs = fs_type[abs(fs_type - fsd) < 1]  # 识别fs_type 中哪一个采样率与fsd的差值小于1，则该采样率即为数据采样率
    if len(fs) == 1:
        return float(fs)
    else:
        return fsd


def dataA(raw_time, raw_data):  # need to be improved
    '''
    :param raw_time:时间数据
    :param raw_data: 声压级数据
    :return: A计权后的数据
    思路：对声压级数据fft后进行频率A计权，后逆fft得到时域上的A计权数据
    '''
    fs = detectFs(raw_time)  # 得到数据采样率
    n = len(raw_time)  # raw_time数据长度
    if n % 2 == 0:
        f = fs * np.arange(n // 2) / n  #####  np.arange(n//2 +1) / n --- NA
        fa = librosa.A_weighting(f)
        temp1 = np.fft.fft(raw_data)
        # temp2 = 20*np.log10(temp1/2e-5)
        faf = 10 ** (fa / 20)  # *2e-5
        faf2 = faf[::-1]
        fafc = np.hstack((faf, faf2))
    else:
        f = fs * np.arange(n // 2 + 1) / (n - 1)  ## f 为 0到22050的列表 len(f) = n//2 + 1
        fa = librosa.A_weighting(f)  # fa:根据频率f得到的频率A计权特性
        temp1 = np.fft.fft(raw_data)
        faf = 10 ** (fa / 20)  # *2e-5    ##### 将分贝的加减转化为声压能量的乘法 temp3 = temp1*fafc
        faf2 = faf[::-1]  # 翻转faf
        fafc = np.hstack((faf, faf2[1:]))  # 拼接faf与faf2  len(fafc) = n
    print(temp1, fafc)
    temp3 = temp1 * fafc[int(abs(len(temp1)-len(fafc ))):]
    temp4 = np.fft.ifft(temp3)  # 逆fft得到temp4
    dataA = temp4.real  # 取实部得到dataA
    return dataA



def rpmSelect2(raw_time, raw_rpm, rpm_step, rpmtype='rising'):
    '''
    :param raw_time:时间数据
    :param raw_rpm:转速数据
    :param rpm_step: 步长
    :param rpmtype:'falling'；
    :return: rpml: 从最低转速到最高转速的列表或从最高转速到最低转速的列表（步长为rpm_step）
              rpmf:对应raw_time中的采样点位置（相差不超过deltaR）
    '''
    if rpmtype == 'falling':  # 如果是falling，将raw_rpm翻转
        raw_rpm = raw_rpm[::-1]
    r_minp = np.argmin(raw_rpm)  # raw_rpm最小值对应位置
    r_maxp = np.argmax(raw_rpm)  # raw_rpm最大值对应位置
    s_rpm = raw_rpm[r_minp:r_maxp + 1]
    rpm_ini = np.ceil(s_rpm[0] / rpm_step) * rpm_step  # rpm_ini：1110
    rpm_end = np.floor(s_rpm[-1] / rpm_step) * rpm_step  # rpm_end：5980
    rpml = np.arange(rpm_ini, rpm_end + rpm_step, rpm_step)  # rpmf: 从最低转速到最高转速的列表（步长为rpm_step）
    rpmf = np.zeros(len(rpml))
    '''
    寻找rpml中每个转速对应的raw_time中的采样点位置（相差不超过deltaR）
    '''
    for i in range(len(rpml)):
        deltaR = 0.05
        t01 = np.where((s_rpm > rpml[i] - deltaR) & (s_rpm < rpml[i] + deltaR))
        # t02 = np.where(np.logical_and(np.greater(s_rpm,rs-deltaR),np.less(s_rpm,rs+deltaR)))
        while np.size(t01, 1) == 0:
            deltaR = deltaR + 0.05
            t01 = np.where((s_rpm > rpml[i] - deltaR) & (s_rpm < rpml[i] + deltaR))
        rpmf[i] = t01[0][0]
    rpmf = rpmf + r_minp  ###  因为s_rpm从r_minp开始取的所以要+r_minp
    if rpmtype == 'falling':
        rpml = rpml[::-1]
        t01 = len(raw_time) - rpmf
        rpmf = t01[::-1]
    return rpmf, rpml


def level_time(raw_time, raw_data, timeWeighting, A):
    '''

    :param raw_time: 时间数据
    :param raw_data: 声压数据
    :param timeWeighting: 积分时间，0.125则为fast 1则为slow
    :param A:如果A =1 则利用dataA进行A计权
    :return: level_time（fsat or slow)后的数据
    思路：将时域的卷积转化为频域的乘积
    期间对时间数据与声压数据进行拼接，使fft与ifft过程更加准确。
    '''
    fs = detectFs(raw_time)
    if A == 1:
        raw_data = dataA(raw_time, raw_data)

    # 对时间数据与声压数据进行拼接，变成3倍长度
    timep1 = raw_time[:-1] - raw_time[-1]
    timep2 = raw_time[1:] + raw_time[-1]
    timep = np.hstack((timep1, raw_time, timep2))
    datap1 = raw_data[::-1]
    datap = np.hstack((datap1[:-1], raw_data, datap1[1:]))
    timepe = timep - timep[0]

    # 将时域的卷积转化为频域的乘积
    raw_e = np.exp(-timepe / timeWeighting)
    ff = np.fft.fft(datap ** 2) * np.fft.fft(raw_e[int(abs(len(datap)-len(raw_e ))):])
    ff2 = np.fft.ifft(ff)
    ff2r = ff2.real
    ff2rs = ff2r[len(raw_time) - 1:len(raw_time) * 2 - 1]

    pa = (ff2rs / fs / timeWeighting) ** 0.5
    lpa = 20 * np.log10(pa / 2e-5)
    return lpa


def level_rpm(raw_time, raw_data, raw_rpm, rpm_step, rpmtype, timeWeighting, A):
    '''
    :param raw_time: 时间数据
    :param raw_data: 声压数据
    :param raw_rpm: 转速数据
    :param rpm_step: 转速步长
    :param rpmtype: 'falling'
    :param timeWeighting: 积分时间长度
    :param A: 如果A =1 则利用dataA进行A计权
    :return: lpr转速为rpml时对应的声压分贝值
    '''
    lpa = level_time(raw_time, raw_data, timeWeighting, A)  # 计算level_time

    # rpml: 从最高转速到最低转速的列表（步长为rpm_step）
    # rpmf:对应raw_time中的采样点位置（相差不超过deltaR）
    rpmf, rpml = rpmSelect2(raw_time, raw_rpm, rpm_step, rpmtype)

    lpr = np.zeros(len(rpmf))
    for i in range(len(rpmf)):
        lpr[i] = lpa[int(rpmf[i]) - 1]  # TODO: 根据rpmf中采样点的位置找寻对应了level_time值
    return rpml, lpr


def order_vfft(raw_time, raw_data, raw_rpm, rpm_step, rpmtype, order, orderResolution, orderWidth, smoothFrac):
    '''
    :param raw_time: 时间数据
    :param raw_data: 声压数据
    :param raw_rpm: 转速数据
    :param rpm_step: 转速步长
    :param rpmtype: 'falling'
    :param order: 需要提取的阶次
    :param orderResolution: 决定每个转速提取的blockSize长度，用于fft
    :param orderWidth: 每个转速对应的阶次频率不一定刚好为fft中对应的频率，故加入orderWidth在一定的误差范围内寻找阶次频率。
    :param smoothFrac: 局部加权回归中的参数值，smoothFrac：截取数据比例
    :return: rpml: 从最低转速到最高转速的列表或从最高转速到最低转速的列表（步长为rpm_step）
              dbo ：对应转速下阶次频率的分贝值
    '''
    fs = detectFs(raw_time)
    (rpmf, rpml) = rpmSelect2(raw_time, raw_rpm, rpm_step, rpmtype)
    dbo = np.zeros(np.size(rpml))
    for i in range(np.size(rpml)):
        ####  根据rpml和orderResolution决定blockSize（即从rpml对应的时间点，往前往后截取的数据长度。）
        fsResolution = rpml[i] / 60 * orderResolution
        blockSize = fs / fsResolution

        try:
            x = raw_data[int(rpmf[i] - blockSize // 2 + 1): int(rpmf[i] + blockSize // 2 + 1)]
            n = len(x)
            wn = hann(n)
            xx = x * wn  # 加汉宁窗
            y = fft(xx)
            f = fs * np.arange(n // 2 + 1) / n
            ####  得到xx对应的fft值后，进一步后处理获得每个频率上对应的声压级
            p = np.abs(y / n)
            p1 = p[:n // 2 + 1]
            p1[1: -1] *= 2
            p2 = 2 * p1
            p2 = p2 * 2 ** -0.5  ###  *0.707得到RMS值
            db = 20 * np.log10(p2 / 2e-5)

            # 寻找order对应的频率，及该频率对应的db值，order对应的频率不可能与f中的频率刚好一致，故通过orderWidth寻找该频带中的频率
            fsFloor = rpml[i] / 60 * (order - orderWidth / 2)
            fsTop = rpml[i] / 60 * (order + orderWidth / 2)
            fsSelected = np.where((f > fsFloor) & (f < fsTop))
            if len(fsSelected[0]) == 1:
                dbo[i] = db[fsSelected[0][0]]
            else:
                #### 如果两个频率都处于2阶转频的范围，则求两条谱线总的db值
                dbs = db[fsSelected[0]]
                ppre = 10 ** (dbs / 20) * 2e-5
                pef = sum(ppre ** 2) ** 0.5
                dbo[i] = 20 * np.log10(pef / 2e-5)

        # 如果上段Tay中的代码有错误则该转速对应的dbo值为0
        except:
            dbo[i] = dbo[i]

    t01 = np.where(dbo != 0)  # 寻找dbo不等于0的位置
    ##### -------------------------------
    rpml = rpml[t01[0]]
    dbo = dbo[t01[0]]  # 舍弃dbo为0的值
    lowess = sm.nonparametric.lowess
    z = lowess(dbo, rpml, frac=smoothFrac)  ####  做局部加权回归，进行平滑，smoothFrac：截取数据比例
    rpml = z[:, 0]
    dbo = z[:, 1]
    return rpml, dbo  #### 对应转速下2阶频率的分贝值


def rms(sig, window_size=None):
    fun = lambda a, size: np.sqrt(np.sum([a[size - i - 1:len(a) - i] ** 2 for i in range(size - 1)]) / size)
    if len(sig.shape) == 2:
        return np.array([rms(each, window_size) for each in sig])
    else:
        if not window_size:
            window_size = len(sig)
        return fun(sig, window_size)


def fft_average(raw_data, spectrum_size, fs, overlap, weighting):
    '''
    :param raw_data: 声压数据
    :param spectrum_size: 谱线数
    :param fs: 采样频率
    :param overlap: 重叠率
    :param weighting: 等于1时计算A计权声级
    :return: f:每条谱线对应的频率
              db:每条谱线对应的声压级
    '''
    stepping = np.floor(spectrum_size * (100 - overlap) / 100)  # 根据spectrum_size和overlap计算每次窗口移动的步长
    window_data = int((len(raw_time) - spectrum_size) // stepping + 1)  # 计算含有多少个窗
    pp = np.zeros((window_data, spectrum_size // 2 + 1))
    n = spectrum_size  # Length for FFT
    wn = hann(n)  # 汉宁窗
    # 计算每个窗对应的频谱
    for i in range(window_data):
        x = raw_data[int(i * stepping):int(i * stepping + spectrum_size)]  # 获得分块数据
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
    # 如果weighting==1则用计算频谱上的A计权声级
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


def fft_time(raw_time, raw_data, spectrum_size, overlap, weighting):
    '''
    :param raw_time: 时间数据
    :param raw_data: 声压数据
    :param spectrum_size: 谱线数
    :param overlap: 重叠率
    :param weighting: 等于1时计算A计权声级
    :return: f:每条谱线对应的频率
              time_array: fft vs time中的时间轴序列
              pm:每一时间每一频率下对应的fft幅值（rms)
    '''
    fs = detectFs(raw_time)
    stepping = np.floor(spectrum_size * (100 - overlap) / 100)
    window_data = int((len(raw_time) - spectrum_size) // stepping + 1)  # 计算窗口数量
    time_array = np.arange(spectrum_size / 2, spectrum_size / 2 + stepping * (window_data), stepping) / fs
    #    time_array = np.arange(raw_time[0],raw_time[0]+spectrum_size/2*(window_data),spectrum_size/2)/fs
    pp = np.zeros((spectrum_size // 2 + 1, window_data))  # 预分配fft_vs_time 矩阵
    # 计算每一time_array时间对应的FFT值
    for i in range(window_data):
        x = raw_data[int(i * stepping):int(i * stepping + spectrum_size)]  # 获得每一窗口的raw_data数据
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


def fft_rpm(raw_time, raw_data, raw_rpm, rpm_step, rpmtype, spectrum_size, fs, weighting):
    '''
    :param raw_time: 时间数据
    :param raw_data: 声压数据
    :param raw_rpm: 转速数据
    :param rpm_step: 转速步长
    :param rpmtype: rpmtype: 'falling'
    :param spectrum_size: 谱线数
    :param fs: 采样率
    :param weighting: 等于1时计算A计权声级
    :return:f:每条谱线对应的频率
             rpml:fft vs rpm中的时间轴序列
             pm:每一转速每一频率下对应的fft幅值（rms)
    '''
    (rpmf, rpml) = rpmSelect2(raw_time, raw_rpm, rpm_step,
                              rpmtype)  # rpml: 从最高转速到最低转速的列表（步长为rpm_step）rpmf:对应raw_time中的采样点位置（相差不超过deltaR）
    pp = np.zeros((spectrum_size // 2 + 1, len(rpml)))
    for i in range(len(rpml)):
        try:
            #### 提取每一转速对应的声压数据（包含spectrum_size个采样点）
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

    # 如果pp中有存在全为0的列则去除，并去除对应的rpml值
    t01 = []
    for i in range(len(rpml)):
        if pp[:, i].all() == 0:
            t01.append(i)
    rpml = np.delete(rpml, t01)
    pp = np.delete(pp, t01, axis=1)
    pm = 20 * np.log10(pp / 2e-5)
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
    ####  缺少 rpmtype
    rpmtype = 'falling'
    rpml, lpr = level_rpm(raw_time, raw_data, raw_rpm, rpm_step, rpmtype, timeWeighting, A)
    ####  -------------------
    plt.figure()
    plt.plot(rpml, lpr)
    order = 2
    orderResolution = 0.5
    orderWidth = 0.5
    smoothFrac = 0.1  # default
    ####  缺少 rpmtype
    (rpml, dbo) = order_vfft(raw_time, raw_data, raw_rpm, rpm_step, rpmtype, order, orderResolution, orderWidth,
                             smoothFrac)
    ####  --------------------
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


def figure_fft_average(raw_time, raw_data, spectrum_size, overlap, weighting):
    fs = detectFs(raw_time)
    (f, db) = fft_average(raw_data, spectrum_size, fs, overlap, weighting)
    plt.figure()
    plt.plot(f, db)
    plt.xscale('log')
    plt.xlim(10, 20000)
    #    plt.ylim(-20,90)
    plt.xlabel('fs/Hz')
    plt.ylabel('dB(A)')
    plt.grid(b=bool, which='both')
    plt.title('fft average')
    plt.tight_layout()
    figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
        np.random.randint(1000, 9999))
    plt.savefig(figurepath)
    plt.close()
    return figurepath


def figure_fft_time(raw_time, raw_data, spectrum_size, overlap, weighting):
    (f, ta, pm) = fft_time(raw_time, raw_data, spectrum_size, overlap, 1)
    # pm = pm.transpose()
    x2, y2 = np.meshgrid(ta, f)
    levels = MaxNLocator(nbins=50).tick_values(pm.min(), pm.max())
    fig, ax = plt.subplots()
    cf = ax.contourf(x2, y2, pm, levels=levels)
    ax.set_yscale('log')
    ax.set_ylim(20, 16000)
    fig.colorbar(cf, ax=ax)
    ax.set_title('contourf for fft versus time')
    fig.tight_layout()
    plt.show()
    figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
        np.random.randint(1000, 9999))
    plt.savefig(figurepath)
    plt.close()
    return figurepath


# filepath = '/home/zheng/Documents/TestData/TEST/ASC/A9I-329 F3 VZ run07_CAN ( 0.00-50.80 s).asc'  # 文件名称
# datam = readAscFile(filepath)
# raw_time = datam[:, 0]
# raw_data = datam[:, 1]
# raw_rpm = datam[:, 5]

channel_dict, datam = read_hdf('2020-03-12_F3 VZ run10.hdf')
print(channel_dict)

# 2019-10-15_Polo NF H20-304 AS F3 vz Run14
# raw_time = datam[6]
# raw_data = datam[4]
# raw_rpm = datam[0]

# 2016-11-10_AGA-30 F3 Vollzug run07
# raw_time = datam[6]
# raw_data = datam[5]
# raw_rpm = datam[0]

# F3 VZ
raw_time = datam[7]
raw_data = datam[4]
raw_rpm = datam[1]

# print("raw_time:", raw_time)
# print("raw_data:", raw_data)
# print("raw_rpm:", raw_rpm)
# print(raw_time)
# print(raw_time.shape)
# print(raw_data.shape)
# print(raw_rpm.shape)
# print(raw_time[5])
# plt.plot(raw_data)
# plt.show()
# fsd = detectFs(raw_time)
# dataA = dataA(raw_time,raw_data)
# rpmf,rpml = rpmSelect2(raw_time,raw_rpm,10,'falling')
# lpa = level_time(raw_time,raw_data,0.125,1)

"""绘图"""
rpml, lpr = level_rpm(raw_time, raw_data, raw_rpm, 10, 'falling', 0.125, 1)

print(rpml, lpr)

plt.figure()
plt.plot(rpml, lpr)
# plt.xscale('log')
# plt.xlim(10, 20000)
plt.xlabel('fs/Hz')
plt.ylabel('dB(A)')
plt.grid(b=bool, which='both')
plt.title('fft average', )
plt.tight_layout()
figure_path = "asd" + "_" + "Zheng" + ".png"
path = "/home/zheng/Desktop/"
image_path = path + figure_path
plt.savefig(image_path)

"""算法调试"""
# rpml,dbo = order_vfft(raw_time,raw_data,raw_rpm,10,'falling',2,0.5,0.5,0.1)
# fs = detectFs(raw_time)
# f,db = fft_average(raw_data,16384,44100,75,1)
# f,time_array,pm = fft_time(raw_time,raw_data,16384,75,1)
# f, rpml, pm = fft_rpm(raw_time, raw_data, raw_rpm, 10, 'falling', 16384, 75, 1)
# figurepath = figure_inner(raw_time,raw_data,raw_rpm,10,2)
# figurepath = figure_fft_average(raw_time,raw_data,16384,75,1)
# figurepath = figure_fft_time(raw_time,raw_data,16384,75,1)

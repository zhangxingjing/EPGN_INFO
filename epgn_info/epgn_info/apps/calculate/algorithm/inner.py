import os

import numpy as np
import librosa
import time
import statsmodels.api as sm
import matplotlib.pyplot as plt
from scipy.signal.windows import hann
from scipy.fftpack import fft
from epgn_info.settings.dev_setting import BASE_DIR


def readAscFile(file_path):  # head_content needs to be completed
    head_content = ""
    data_content = ""
    fileRead = open('/home/spider/Music/700001 ( 0.00-14.80 s)with head.asc', 'r', encoding='gbk')
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
    if len(content_list) != 0:
        splitTag = ' '
    else:
        content_list = content_line_list[0].split('\t')
        if len(content_list) != 0:
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
    # fs = detectFs(raw_time)
    # r_min = np.min(raw_rpm)
    # r_max = np.max(raw_rpm)
    r_minp = np.argmin(raw_rpm)
    r_maxp = np.argmax(raw_rpm)
    # s_time = raw_time[r_minp:r_maxp + 1]
    s_rpm = raw_rpm[r_minp:r_maxp + 1]
    rpm_ini = np.ceil(s_rpm[0] / rpm_step) * rpm_step
    rpm_end = np.floor(s_rpm[-1] / rpm_step) * rpm_step
    rpml = np.arange(rpm_ini, rpm_end + rpm_step, rpm_step)
    rpmf = np.zeros(len(rpml))
    for i in range(len(rpml)):
        deltaR = 0.05
        t01 = np.where((s_rpm > rpml[i] - deltaR) & (s_rpm < rpml[i] + deltaR))
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
    plt.grid(b=bool, which='both')
    plt.tight_layout()
    plt.legend(('level(A)', '2nd order'))
    # 在这里返回指定的文件名和指定的图片存储路径
    figurepath = 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(np.random.randint(1000, 9999)) + ".png"
    path = os.path.join(os.path.dirname(BASE_DIR)) + "/epgn_info/apps/calculate/algorithm/image/"
    image_path = path + figurepath
    plt.savefig(image_path)
    plt.show()
    plt.close()
    return image_path


# 内部噪声
def inner(filepath):
    datam = readAscFile(filepath)
    # 1，6 对于不同文件需要修改，形参， ==> 错误文件使用 10000:-10000
    try:
        raw_time = datam[10000:-10000, 0]
        raw_data = datam[10000:-10000, 1]
        raw_rpm = datam[10000:-10000, 6]
        image_path = figure_inner(raw_time, raw_data, raw_rpm, 25, 2)
    except Exception as error:
        raw_time = datam[:, 0]
        raw_data = datam[:, 1]
        raw_rpm = datam[:, 6]
        image_path = figure_inner(raw_time, raw_data, raw_rpm, 25, 2)
    # 这里返回静态文件绝对路径
    return image_path

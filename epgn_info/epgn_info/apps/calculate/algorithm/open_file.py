# -*- coding: utf-8 -*-

# import math
import numpy as np
import matplotlib.pyplot as plt
import librosa


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
    for read_line in content_line_list:
        content_list = read_line.split(' ')
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


def total_db_time(raw_time, raw_data, weighting):  # completed  raw_data must be 1-n size
    if weighting == 1:
        raw_data = dataA(raw_time, raw_data)
    n = len(raw_data)
    pe = (sum(raw_data ** 2) / n) ** 0.5
    db = np.log10(pe / 2e-5) * 20
    return db


def sum_db(raw_data, windowType='none'):
    data_recovery = 10 ** (raw_data / 20) * 2e-5
    if windowType == 'none':
        sum_db = 20 * np.log10(sum(data_recovery ** 2) ** 0.5 / 2e-5)
    elif windowType == 'hann':
        sum_db = 20 * np.log10(sum((data_recovery / 2 * 1.633) ** 2) ** 0.5 / 2e-5)
    return sum_db


def filterA(f, plotFilter=None):
    c1 = 3.5041384e16
    c2 = 20.598997 ** 2
    c3 = 107.65265 ** 2
    c4 = 737.86223 ** 2
    c5 = 12194.217 ** 2
    # Evaluate A - weighting filter.
    f[np.abs(f - 0) < 1e-17] = 1e-17
    f = f ** 2
    num = c1 * f ** 4
    den = ((c2 + f) ** 2) * (c3 + f) * (c4 + f) * ((c5 + f) ** 2)
    A = num / den
    # Plot A - weighting filter( if enabled).
    if plotFilter:
        # Plot using dB scale.
        plt.figure(2)
        plt.semilogx(np.sqrt(f), 10 * np.log10(A))
        plt.title('A-weighting Filter')
        plt.xlabel('Frequency (Hz)')
        plt.ylabel('Magnitude (dB)')
        plt.xlim([10, 100e3])
        plt.ylim([-70, 10])
        # Plot using linear scale.
        plt.figure(3)
        plt.plot(np.sqrt(f), A)
        plt.title('A-weighting Filter')
        plt.xlabel('Frequency (Hz)')
        plt.ylabel('Amplitude')
        plt.xlim([0, 44.1e3 / 2])
        plt.show()
    return A


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
    #    plt.figure()
    #    plt.plot(raw_time,raw_rpm)
    #    plt.plot(rpmf/fs,rpml,'ro')
    return rpmf, rpml

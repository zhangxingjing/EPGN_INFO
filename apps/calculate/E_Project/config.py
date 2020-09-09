# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author : Zheng Xingtao
# File : config.py
# Datetime : 2020/8/12 上午9:11


import re
import h5py
import librosa
import numpy as np
import statsmodels.api as sm
from scipy.fftpack import fft
from scipy.signal.windows import hann

# 文件存储的绝对路径
FILE_READ_PATH = "/home/zheng/Documents/WorkFile/R_HDF/"

# 参考通道列表
REFERENCE_CHANNEL = ["EngineRPM"]

# 算法参数
epsilon = 1e-5


class CalculateObject(object):
    def __init__(self,
                 channel_data,
                 raw_time_num,
                 raw_data_num,
                 raw_rpm_num,
                 A=1,
                 order=2,
                 overlap=75,
                 weighting=1,
                 rpm_step=10,
                 smoothFrac=0.1,
                 orderWidth=0.5,
                 rpmtype="rasing",
                 timeWeighting=0.125,
                 orderResolution=0.5,
                 spectrum_size=16384,
                 ):
        self.A = A
        self.order = order
        self.overlap = overlap
        self.weighting = weighting
        self.rpm_step = rpm_step
        self.smoothFrac = smoothFrac
        self.orderWidth = orderWidth
        self.rpmtype = rpmtype
        self.timeWeighting = timeWeighting
        self.orderResolution = orderResolution
        self.spectrum_size = spectrum_size
        self.raw_time = channel_data[raw_time_num]
        self.raw_data = channel_data[raw_data_num]
        self.raw_rpm = channel_data[raw_rpm_num]
        self.fs = self.detectFs()
        self.sespectrum_size = "",
        self.weightingaself = "",

    def detectFs(self):  # seems to be completed
        fs_type = [4096, 8192, 16384, 32768, 65536, 22050, 44100, 48000]
        fs_type = np.array(fs_type)
        fsd = len(self.raw_time) / self.raw_time[-1]  # 数据采样率，指单位时间的采样点数
        fs = fs_type[abs(fs_type - fsd) < 1]  # [44100]
        if len(fs) == 1:
            return float(fs)
        return fsd

    def dataA(self):  # need to be improved
        n = len(self.raw_time)
        if n % 2 == 0:
            f = self.fs * np.arange(n // 2) / n
            fa = librosa.A_weighting(f)
            temp1 = np.fft.fft(self.raw_data)
            faf = 10 ** (fa / 20)  # *2e-5
            faf2 = faf[::-1]
            fafc = np.hstack((faf, faf2))
        else:
            f = self.fs * np.arange(n // 2 + 1) / n
            fa = librosa.A_weighting(f)
            temp1 = np.fft.fft(self.raw_data)
            faf = 10 ** (fa / 20)  # *2e-5
            faf2 = faf[::-1]
            fafc = np.hstack((faf, faf2[1:]))
        temp3 = temp1 * fafc[int(abs(len(temp1) - len(fafc))):]
        temp4 = np.fft.ifft(temp3)
        dataA = temp4.real
        return dataA

    def rpmSelect2(self):
        raw_rpm = self.raw_rpm
        if self.rpmtype == 'falling':
            raw_rpm = self.raw_rpm[::-1]
        # raw_rpm = self.raw_rpm[::-1]
        r_minp = np.argmin(raw_rpm)
        r_maxp = np.argmax(raw_rpm)
        s_rpm = raw_rpm[r_minp:r_maxp + 1]
        rpm_ini = np.ceil(s_rpm[0] / self.rpm_step) * self.rpm_step
        rpm_end = np.floor(s_rpm[-1] / self.rpm_step) * self.rpm_step
        rpml = np.arange(rpm_ini, rpm_end + self.rpm_step, self.rpm_step)
        rpmf = np.zeros(len(rpml))
        for i in range(len(rpml)):
            deltaR = 0.05
            t01 = np.where((s_rpm > rpml[i] - deltaR) & (s_rpm < rpml[i] + deltaR))
            while np.size(t01, 1) == 0:
                deltaR = deltaR + 0.05
                t01 = np.where((s_rpm > rpml[i] - deltaR) & (s_rpm < rpml[i] + deltaR))
            rpmf[i] = t01[0][0]
        rpmf = rpmf + r_minp
        if self.rpmtype == 'falling':
            rpml = rpml[::-1]
            t01 = len(self.raw_time) - rpmf
            rpmf = t01[::-1]
        return rpmf, rpml

    def sum_db(self, raw_data=None, windowType='none'):
        raw_data_info = self.raw_data
        if raw_data is not None:
            raw_data_info = raw_data
        data_recovery = 10 ** (raw_data_info / 20) * 2e-5
        sum_db = []
        if windowType == 'none':
            sum_db = 20 * np.log10(sum(data_recovery ** 2) ** 0.5 / 2e-5 + epsilon)
        elif windowType == 'hann':
            sum_db = 20 * np.log10(sum((data_recovery / 2 * 1.633) ** 2) ** 0.5 / 2e-5 + epsilon)
        return sum_db

    def return_item(self, A, B):
        return [A, B]


class LevelTime(CalculateObject):
    def level_time(self):
        raw_data = self.raw_data
        if self.A == 1:
            raw_data = self.dataA()
        # raw_data = self.dataA()

        timep1 = self.raw_time[:-1] - self.raw_time[-1]
        timep2 = self.raw_time[1:] + self.raw_time[-1]
        timep = np.hstack((timep1, self.raw_time, timep2))
        datap1 = raw_data[::-1]  # 这里使用变量的时候 ==> 注意变量名
        datap = np.hstack((datap1[:-1], raw_data, datap1[1:]))
        timepe = timep - timep[0]

        raw_e = np.exp(-timepe / self.timeWeighting)

        # 当
        # ff = np.fft.fft(datap ** 2) * np.fft.fft(raw_e[int(abs(len(datap) - len(raw_e))):])  # * fa
        ff = np.fft.fft(datap ** 2) * np.fft.fft(raw_e)  # * fa
        ff2 = np.fft.ifft(ff)
        ff2r = ff2.real
        ff2rs = ff2r[len(self.raw_time) - 1:len(self.raw_time) * 2 - 1]
        pa = (ff2rs / self.fs / self.timeWeighting) ** 0.5
        lpa = 20 * np.log10(pa / 2e-5 + epsilon)
        return self.raw_time, lpa

    def level_rpm(self):
        raw_data, lpa = self.level_time()
        rpmf, rpml = self.rpmSelect2()  # TODO: 上面一行有数据， 这一步之后没有结果了
        lpr = np.zeros(len(rpmf))
        for i in range(len(rpmf)):
            lpr[i] = lpa[int(rpmf[i]) - 1]  # 最后一项是n-1
        return rpml, lpr


class Oederfft(CalculateObject):
    def order_vfft(self):
        rpmf, rpml = self.rpmSelect2()
        dbo = np.zeros(np.size(rpml))
        for i in range(np.size(rpml)):
            fsResolution = rpml[i] / 60 * self.orderResolution
            blockSize = self.fs / fsResolution
            try:
                x = self.raw_data[int(rpmf[i] - blockSize // 2 + 1): int(rpmf[i] + blockSize // 2 + 1)]
                n = len(x)
                wn = hann(n)
                xx = x * wn
                y = fft(xx)
                f = self.fs * np.arange(n // 2 + 1) / n
                p = np.abs(y / n)
                p1 = p[:n // 2 + 1]
                p1[1: -1] *= 2
                p2 = 2 * p1
                p2 = p2 * 2 ** -0.5
                db = 20 * np.log10(p2 / 2e-5 + epsilon)
                fsFloor = rpml[i] / 60 * (self.order - self.orderWidth / 2)
                fsTop = rpml[i] / 60 * (self.order + self.orderWidth / 2)
                fsSelected = np.where((f > fsFloor) & (f < fsTop))
                if len(fsSelected[0]) == 1:
                    dbo[i] = db[fsSelected[0][0]]
                else:
                    dbs = db[fsSelected[0]]
                    ppre = 10 ** (dbs / 20) * 2e-5
                    pef = sum(ppre ** 2) ** 0.5
                    dbo[i] = 20 * np.log10(pef / 2e-5 + epsilon)
            except:
                dbo[i] = dbo[i]
        t01 = []
        for i in range(len(rpml)):
            t01 = np.where(dbo != 0)
        rpml = rpml[t01[0]]
        dbo = dbo[t01[0]]
        lowess = sm.nonparametric.lowess
        z = lowess(dbo, rpml, frac=self.smoothFrac)
        rpml = z[:, 0]
        dbo = z[:, 1]
        return rpml, dbo

    def rms(self, sig, window_size=None):
        fun = lambda a, size: np.sqrt(np.sum([a[size - i - 1:len(a) - i] ** 2 for i in range(size - 1)]) / size)
        if len(sig.shape) == 2:
            return np.array([self.rms(each, window_size) for each in sig])
        else:
            if not window_size:
                window_size = len(sig)
            return fun(sig, window_size)


class FftInfo(LevelTime, Oederfft):
    def fft_average(self):
        stepping = np.floor(self.spectrum_size * (100 - self.overlap) / 100)
        window_data = int((len(self.raw_time) - self.spectrum_size) // stepping + 1)
        pp = np.zeros((window_data, self.spectrum_size // 2 + 1))  # fft_vs_time
        n = self.spectrum_size  # Length for FFT
        wn = hann(n)  # 汉宁窗
        f = []
        for i in range(window_data):
            x = self.raw_data[int(i * stepping):int(i * stepping + self.spectrum_size)]  # 获得分块数据'=
            xx = x * wn  # 分块数据加窗
            y = fft(xx)
            f = self.fs * np.arange(n // 2 + 1) / n  # 频域取FFT结果的前一半
            p = np.abs(y / n)  # FFT结果取模值
            p1 = p[:n // 2 + 1]  # FFT结果取前半部分
            p1[1: -1] *= 2  # FFT后半部分幅值叠加到前半部分
            p2 = 2 * p1  # 恢复窗函数幅值
            p2 = p2 * 2 ** -0.5  # peak to rms
            pp[i, 0:] = p2  # 生成所有分块数据的FFT矩阵
        pp_avr = self.rms(pp.transpose())  # 对分块数据求均方根
        db = 20 * np.log10(pp_avr / 2.0e-5 + epsilon)  # 将幅值转为声压级
        if self.weighting == 1:
            dba = db + librosa.A_weighting(f)
            return f, dba
        else:
            return f, db


class FftCalculate(FftInfo):
    def run(self):
        f, db = self.fft_average()
        return self.return_item(f, db)


class FFT_RPM(CalculateObject):
    def fft_rpm(self):
        (rpmf, rpml) = self.rpmSelect2()
        pp = np.zeros((self.spectrum_size // 2 + 1, len(rpml)))
        for i in range(len(rpml)):
            try:
                #### 提取每一转速对应的声压数据（包含spectrum_size个采样点）
                x = self.raw_data[int(rpmf[i] - self.spectrum_size / 2 + 1):int(rpmf[i] + self.spectrum_size / 2 + 1)]
                n = self.spectrum_size  # Length for FFT
                wn = hann(n)
                xx = x * wn
                y = fft(xx)
                f = self.fs * np.arange(n // 2 + 1) / n
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
        if self.weighting == 1:
            for i in range(len(rpml)):
                pm[:, i] = pm[:, i] + librosa.A_weighting(f)
            return f, rpml, pm
        else:
            return f, rpml, pm


class LevelVsRpm(LevelTime):
    def run(self):
        rpml, lpr = self.level_rpm()
        return rpml, lpr


# 解析map对象
class MapResult(object):
    """
    实例化一个map对象，获取参数后，整理发给算法
    对于多通道的情况，使用pool/celery，处理多任务
    """

    def __init__(self, map_data):
        self.params_dict = {}
        self.imageType = map_data["imageType"]
        self.imageCount = map_data["imageCount"]
        self.fileChannels = map_data["fileChannels"]
        self.algorithmName = map_data["algorithmName"]
        self.algorithmParams = map_data["algorithmParams"]
        self.channel_data = self.channel_time_num = self.channel_data_num = self.reference_channel_num = ""

    @staticmethod
    def read_hdf(file_name):
        file_path = FILE_READ_PATH + file_name
        read_info = h5py.File(file_path, 'r')
        items = []
        channel_dict = {}
        i = 1
        for key in read_info.keys():
            items.append(read_info[key][:])
            channel_dict["Channel " + str(i)] = key
            i += 1
        return channel_dict, items

    def data_for_calculate(self):
        """
        已经选定了一个算法，这里直接进入算法
        将map中的参数发送给算法
        :return:
        """

        # 其他参数
        for param in self.algorithmParams:
            for param_key, param_value in param.items():
                self.params_dict.update({param_key: param_value})

        # 文件信息
        for file_info in self.fileChannels:


            file_name = file_info["fileId"]


            ckChannelInfos = file_info["ckChannelInfos"]
            stdChannelInfo_list = file_info["stdChannelInfos"]
            channel_dict, items = self.read_hdf(file_name)

            self.channel_data = items

            # time
            channel_time = list(channel_dict.keys())[list(channel_dict.values()).index("time")]
            self.channel_time_num = re.match(r'.*?(\d+)', channel_time).group(1)

            # reference
            reference_channel_key = list(channel_dict.keys())[
                list(channel_dict.values()).index("{}".format(ckChannelInfos))]
            self.reference_channel_num = re.match(r'.*?(\d+)', reference_channel_key).group(1)

            for channel in stdChannelInfo_list:
                try:
                    # data
                    channel_data_key = list(channel_dict.keys())[
                        list(channel_dict.values()).index("{}".format(channel))]
                    self.channel_data_num = re.match(r'.*?(\d+)', channel_data_key).group(1)

                    # TODO： 通过file_id 获取 file_name
                    fileId = file_name

                    # TODO： 通过file_id 获取 工况信息
                    status = file_name

                    config_dict = {
                        "file_name": file_name,
                        "fileId": fileId,
                        "status": status,
                        "channel": channel,
                        "params_dict": self.params_dict,
                        "channel_data": self.channel_data,
                        "channel_time_num": int(self.channel_time_num) - 1,
                        "channel_data_num": int(self.channel_data_num) - 1,
                        "reference_channel_num": int(self.reference_channel_num) - 1
                    }
                    # yield config_dict
                    yield file_name, \
                          fileId, \
                          status, \
                          channel,\
                          self.params_dict, \
                          self.channel_data, \
                          int(self.channel_time_num) - 1, \
                          int(self.channel_data_num) - 1, \
                          int(self.reference_channel_num) - 1
                except:
                    continue

    def return_two_data(self, return_data, result_list):
        """返回二维数据"""
        items = []
        for result in result_list:
            item = {
                    "filename": return_data["filename"],
                    "channel": return_data["channel"],
                    "fileId": return_data["fileId"],
                    "status": return_data["status"],
                    "x": result[0],
                    "y": result[1]
                }
            items.append(item)
        return {
            "code": 1,
            "data": items
        }

    def return_there_data(self):
        """返回三维数据"""
        ...

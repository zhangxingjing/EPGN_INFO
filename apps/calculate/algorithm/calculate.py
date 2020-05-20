import os
import time
import librosa
import numpy as np
import statsmodels.api as sm
from scipy.fftpack import fft
import matplotlib.pyplot as plt
from settings.pro import BASE_DIR
from scipy.signal.windows import hann
from scipy.signal import butter, lfilter

epsilon = 1e-5


class Calculate_Object(object):
    def __init__(self, file_name, channel_data, rpm_type, channel_name, raw_time_num, raw_data_num, raw_rpm_num):
        self.A = 1
        self.order = 2
        self.overlap = 75
        self.weighting = 1
        self.rpm_step = 10
        self.smoothFrac = 0.1
        self.orderWidth = 0.5
        self.rpmtype = rpm_type
        self.timeWeighting = 0.125
        self.orderResolution = 0.5
        self.spectrum_size = 16384
        self.absolute_dir = os.getcwd() + '/'
        self.raw_time = channel_data[raw_time_num]
        self.raw_data = channel_data[raw_data_num]
        self.raw_rpm = channel_data[raw_rpm_num]
        # 使用asc文件读取时，channel_data获取的应该是当前列，那在这里获取就应该使用下面这种方式
        # self.raw_time = self.item[:, raw_time_num]
        # self.raw_data = self.item[:, raw_data_num]
        # self.raw_rpm = self.item[:, raw_rpm_num]
        self.fs = self.detectFs()

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

        # TODO: 这里数据做判断的时候，注意加减速
        print(self.rpmtype, self.timeWeighting)
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

    def save_img(self):
        figure_path = 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + ".png"
        # path = os.path.join(os.path.dirname(BASE_DIR)) + "/epgn_info/apps/calculate/algorithm/image/"
        path = os.path.join(os.path.dirname(os.path.dirname(BASE_DIR))) + "/epgn_front_end/calculate_image/"
        image_path = path + figure_path
        plt.savefig(image_path)
        plt.show()
        plt.close()
        return image_path


class LevelTime(Calculate_Object):
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
        return raw_data, lpa

    def level_rpm(self):
        raw_data, lpa = self.level_time()
        rpmf, rpml = self.rpmSelect2()  # rpmSelect2应该是没有问题的
        lpr = np.zeros(len(rpmf))
        for i in range(len(rpmf)):
            lpr[i] = lpa[int(rpmf[i]) - 1]  # 最后一项是n-1
        return rpml, lpr
        # return rpml, lpr.astype(np.int32)


class OederVfft(Calculate_Object):
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


class FftInfo(LevelTime, OederVfft):
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

    def fft_time(self):
        stepping = np.floor(self.spectrum_size * (100 - self.overlap) / 100)
        window_data = int((len(self.raw_time) - self.spectrum_size) // stepping + 1)
        time_array = np.arange(self.spectrum_size / 2, self.spectrum_size / 2 + stepping * (window_data),
                               stepping) / self.fs
        pp = np.zeros((self.spectrum_size // 2 + 1, window_data))  # 预分配fft_vs_time 矩阵
        f = []
        for i in range(window_data):
            x = self.raw_data[int(i * stepping):int(i * stepping + self.spectrum_size)]  # 获得分块数据'=
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
        pm = 20 * np.log10(pp / 2e-5 + epsilon)
        if self.weighting == 1:
            for i in range(window_data):
                pm[:, i] = pm[:, i] + librosa.A_weighting(f)
            return f, time_array, pm
        else:
            return f, time_array, pm

    def fft_rpm(self):
        t01 = []
        f = []
        (rpmf, rpml) = self.rpmSelect2()
        pp = np.zeros((self.spectrum_size // 2 + 1, len(rpml)))
        for i in range(len(rpml)):
            try:
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
        for i in range(len(rpml)):
            t01 = np.where(pp[0, :] != 0)
        rpml = rpml[t01[0]]
        pp = pp[:, t01[0]]
        pm = 20 * np.log10(pp / 2e-5 + epsilon)

        """
        如果上面执行的是except里面的代码，这里在哪里拿到f
        """

        if self.weighting == 1:
            for i in range(len(rpml)):
                pm[:, i] = pm[:, i] + librosa.A_weighting(f)
            return f, rpml, pm
        else:
            return f, rpml, pm

    def octave_fft(self):
        (fl, db) = self.fft_average()
        fb = np.array([22.5, 45, 90, 180, 355, 710, 1400, 2800, 5600, 11200])
        fc = np.array([31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000])
        ft = np.array([45, 90, 180, 355, 710, 1400, 2800, 5600, 11200, 22400])
        octave = np.array([])
        for i in range(len(fc)):
            fselected = np.where((fl > fb[i]) & (fl < ft[i]))
            octave_db = self.sum_db(db[fselected[0]])
            octave = np.hstack((octave, octave_db))
        return fc, octave

    def figure_inner(self):
        (rpml, lpr) = self.level_rpm()
        plt.figure()
        plt.plot(rpml, lpr)
        (rpml, dbo) = self.order_vfft()
        plt.plot(rpml, dbo)
        plt.xlabel('rpm')
        plt.ylabel('db')
        plt.grid(b=bool, which='both')
        plt.tight_layout()
        plt.legend(('level(A)', '2nd order'))
        image_path = self.save_img()
        return image_path


# FFT
class FftCalculate(FftInfo):
    def run(self):
        f, db = self.fft_average()
        # plt.figure()
        # plt.plot(f, db)
        # plt.xscale('log')
        # plt.xlim(10, 20000)
        # plt.xlabel('fs/Hz')
        # plt.ylabel('dB(A)')
        # plt.grid(b=bool, which='both')
        # plt.title('fft average', )
        # plt.tight_layout()
        # image_path = self.save_img()
        # print(image_path)
        return f, db


# 倍频程
class OctaveFft(FftInfo):
    def run(self):
        fc, db = self.octave_fft()
        return fc, db


# 二阶对转速
class OrderVsVfft(OederVfft):
    def run(self):
        rpml, dbo = self.order_vfft()
        return rpml, dbo


# LEVEL对时间（A）
class LevelVsTime(LevelTime):
    def run(self):
        raw_time, lpa = self.level_time()
        return raw_time, lpa


# LEVEL对转速
class LevelVsRpm(LevelTime):
    def run(self):
        self.timeWeighting = 1  # 初始化timeWeighting
        rpml, lpr = self.level_rpm()
        # plt.figure()
        # plt.plot(rpml, lpr)
        # plt.xscale('log')
        # plt.xlim(10, 20000)
        # plt.xlabel('fs/Hz')
        # plt.ylabel('dB(A)')
        # plt.grid(b=bool, which='both')
        # plt.title('fft average', )
        # plt.tight_layout()
        # plt.show()
        # image_path = self.save_img()
        # print(image_path)
        return rpml, lpr


# 启停算法
class StartStop(Calculate_Object):
    """
    从前端传到后台的数据处理之后，接入算法的时候，算法应该返回当前数据的X、Y坐标数据
    返回值为： X Y
    """

    def butter_lowpass(self, cutoff, fs, order=5):
        '''
        构建滤波器
        '''
        nyq = 0.5 * fs
        normal_cutoff = cutoff / nyq
        b, a = butter(order, normal_cutoff, btype='low', analog=False)
        return b, a

    def butter_lowpass_filter(self, data, fs, cutoff, order=5):
        '''
        信号滤波
        '''
        b, a = self.butter_lowpass(cutoff, fs, order=order)
        y = lfilter(b, a, data)
        return y

    def run(self, cutoff=30, order=4):
        '''
        :param raw_time: 时间数据
        :param raw_data: 一个方向的加速度数据
        :param cutoff: 截止频率,默认30Hz
        :param order: 滤波器阶数，默认4阶
        '''
        fs = self.detectFs()
        y = self.butter_lowpass_filter(self.raw_data, fs, cutoff=30, order=4)
        return self.raw_time, y

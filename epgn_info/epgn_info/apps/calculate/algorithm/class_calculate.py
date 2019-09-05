import os
import time
import librosa
import numpy as np
import statsmodels.api as sm
from scipy.fftpack import fft
import matplotlib.pyplot as plt
from scipy.signal.windows import hann
from matplotlib.ticker import MaxNLocator

absolute_dir = os.getcwd() + '/'


def readAscFile(file_path):
    """
    通过文件绝对路径，获取当前文件中的数据
    :return:
    """
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


class Calculate():

    def __init__(self):
        self.absolute_dir = os.getcwd() + '/'
        self.file_path = '/home/spider/Music/大众/EPGN_INGO/100032 ( 0.00-53.35 s).asc'
        self.raw_time = readAscFile(self.file_path)[:, 0]
        self.raw_data = readAscFile(self.file_path)[:, 1]
        self.raw_rpm = readAscFile(self.file_path)[:, 8]

        self.rpm_step = 10
        self.rpmtype = 'falling'
        self.timeWeighting = 0.125
        self.A = 1
        self.orderResolution = 0.5
        self.orderWidth = 0.5
        self.smoothFrac = 0.1
        self.order = 2

        self.spectrum_size = 16384
        self.overlap = 75
        self.weighting = 1
        # sig, window_size = None

    def detectFs(self):  # seems to be completed
        fs_type = [4096, 8192, 16384, 32768, 65536, 22050, 44100, 48000]
        fs_type = np.array(fs_type)
        fsd = len(self.raw_time) / self.raw_time[-1]
        fs = fs_type[abs(fs_type - fsd) < 1]
        if len(fs) == 1:
            return float(fs)
        else:
            return fsd

    def dataA(self):  # need to be improved
        fs = self.detectFs()
        n = len(self.raw_time)
        if n % 2 == 0:
            f = fs * np.arange(n // 2) / n
            fa = librosa.A_weighting(f)
            temp1 = np.fft.fft(self.raw_data)
            # temp2 = 20*np.log10(temp1/2e-5)
            faf = 10 ** (fa / 20)  # *2e-5
            faf2 = faf[::-1]
            fafc = np.hstack((faf, faf2))
        else:
            f = fs * np.arange(n // 2 + 1) / n
            fa = librosa.A_weighting(f)
            temp1 = np.fft.fft(self.raw_data)
            # temp2 = 20*np.log10(temp1/2e-5)
            faf = 10 ** (fa / 20)  # *2e-5
            faf2 = faf[::-1]
            fafc = np.hstack((faf, faf2[1:]))
        temp3 = temp1 * fafc
        temp4 = np.fft.ifft(temp3)
        dataA = temp4.real
        return dataA

    def rpmSelect2(self):
        raw_rpm = self.raw_rpm
        if self.rpmtype == 'falling':
            raw_rpm = self.raw_rpm[::-1]
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

    def sum_db(self, raw_data, windowType='none'):
        raw_data_info = self.raw_data
        if raw_data:
            raw_data_info = raw_data
        data_recovery = 10 ** (raw_data_info / 20) * 2e-5
        if windowType == 'none':
            sum_db = 20 * np.log10(sum(data_recovery ** 2) ** 0.5 / 2e-5)
        elif windowType == 'hann':
            sum_db = 20 * np.log10(sum((data_recovery / 2 * 1.633) ** 2) ** 0.5 / 2e-5)
        return sum_db

    def level_time(self):
        fs = self.detectFs()
        raw_data = self.raw_data
        if self.A == 1:
            raw_data = self.dataA()

        timep1 = self.raw_time[:-1] - self.raw_time[-1]
        timep2 = self.raw_time[1:] + self.raw_time[-1]
        timep = np.hstack((timep1, self.raw_time, timep2))
        datap1 = raw_data[::-1]  # 这里使用变量的时候 ==> 注意变量名
        datap = np.hstack((datap1[:-1], raw_data, datap1[1:]))
        timepe = timep - timep[0]

        raw_e = np.exp(-timepe / self.timeWeighting)
        ff = np.fft.fft(datap ** 2) * np.fft.fft(raw_e)  # * fa
        ff2 = np.fft.ifft(ff)
        ff2r = ff2.real
        ff2rs = ff2r[len(self.raw_time) - 1:len(self.raw_time) * 2 - 1]
        pa = (ff2rs / fs / self.timeWeighting) ** 0.5
        lpa = 20 * np.log10(pa / 2e-5)
        return lpa

    def level_rpm(self):
        lpa = self.level_time()
        (rpmf, rpml) = self.rpmSelect2()
        lpr = np.zeros(len(rpmf))
        for i in range(len(rpmf)):
            lpr[i] = lpa[int(rpmf[i])]
        return rpml, lpr

    def order_vfft(self):
        fs = self.detectFs()
        (rpmf, rpml) = self.rpmSelect2()
        dbo = np.zeros(np.size(rpml))
        for i in range(np.size(rpml)):
            fsResolution = rpml[i] / 60 * self.orderResolution
            blockSize = fs / fsResolution
            try:
                x = self.raw_data[int(rpmf[i] - blockSize // 2 + 1): int(rpmf[i] + blockSize // 2 + 1)]
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
                fsFloor = rpml[i] / 60 * (self.order - self.orderWidth / 2)
                fsTop = rpml[i] / 60 * (self.order + self.orderWidth / 2)
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
        z = lowess(dbo, rpml, frac=self.smoothFrac)
        rpml = z[:, 0]
        dbo = z[:, 1]
        return rpml, dbo

    def rms(self, sig, window_size=None):
        # sig, window_size = None
        fun = lambda a, size: np.sqrt(np.sum([a[size - i - 1:len(a) - i] ** 2 for i in range(size - 1)]) / size)
        if len(sig.shape) == 2:
            return np.array([self.rms(each, window_size) for each in sig])
        else:
            if not window_size:
                window_size = len(sig)
            return fun(sig, window_size)

    def fft_average(self):
        # raw_data, spectrum_size, fs, overlap, weighting
        stepping = np.floor(self.spectrum_size * (100 - self.overlap) / 100)
        window_data = int((len(self.raw_time) - self.spectrum_size) // stepping + 1)
        pp = np.zeros((window_data, self.spectrum_size // 2 + 1))  # fft_vs_time
        n = self.spectrum_size  # Length for FFT
        wn = hann(n)  # 汉宁窗
        for i in range(window_data):
            x = self.raw_data[int(i * stepping):int(i * stepping + self.spectrum_size)]  # 获得分块数据'=
            xx = x * wn  # 分块数据加窗
            y = fft(xx)
            fs = self.detectFs()
            f = fs * np.arange(n // 2 + 1) / n  # 频域取FFT结果的前一半
            p = np.abs(y / n)  # FFT结果取模值
            p1 = p[:n // 2 + 1]  # FFT结果取前半部分
            p1[1: -1] *= 2  # FFT后半部分幅值叠加到前半部分
            p2 = 2 * p1  # 恢复窗函数幅值
            p2 = p2 * 2 ** -0.5  # peak to rms
            pp[i, 0:] = p2  # 生成所有分块数据的FFT矩阵
        pp_avr = self.rms(pp.transpose())  # 对分块数据求均方根
        db = 20 * np.log10(pp_avr / 2.0e-5)  # 将幅值转为声压级
        if self.weighting == 1:
            dba = db + librosa.A_weighting(f)
            return f, dba
        else:
            return f, db

    def fft_time(self):
        # raw_time, raw_data, spectrum_size, overlap, weighting
        fs = self.detectFs()
        stepping = np.floor(self.spectrum_size * (100 - self.overlap) / 100)
        window_data = int((len(self.raw_time) - self.spectrum_size) // stepping + 1)
        time_array = np.arange(self.spectrum_size / 2, self.spectrum_size / 2 + stepping * (window_data), stepping) / fs
        pp = np.zeros((self.spectrum_size // 2 + 1, window_data))  # 预分配fft_vs_time 矩阵
        for i in range(window_data):
            x = self.raw_data[int(i * stepping):int(i * stepping + self.spectrum_size)]  # 获得分块数据'=
            n = self.spectrum_size  # Length for FFT
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
        if self.weighting == 1:
            for i in range(window_data):
                pm[:, i] = pm[:, i] + librosa.A_weighting(f)
            return f, time_array, pm
        else:
            return f, time_array, pm

    def fft_rpm(self):
        # raw_time, raw_data, raw_rpm, rpm_step, rpmtype, spectrum_size, fs, weighting
        (rpmf, rpml) = self.rpmSelect2()
        pp = np.zeros((self.spectrum_size // 2 + 1, len(rpml)))
        for i in range(len(rpml)):
            try:
                x = self.raw_data[int(rpmf[i] - self.spectrum_size / 2 + 1):int(rpmf[i] + self.spectrum_size / 2 + 1)]
                n = self.spectrum_size  # Length for FFT
                wn = hann(n)
                xx = x * wn
                y = fft(xx)
                fs = self.detectFs()
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
        if self.weighting == 1:
            for i in range(len(rpml)):
                pm[:, i] = pm[:, i] + librosa.A_weighting(f)
            return f, rpml, pm
        else:
            return f, rpml, pm

    def octave_fft(self):
        # raw_data, spectrum_size, fs, overlap, weighting
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
        # raw_time, raw_data, raw_rpm, rpm_step, order
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
        plt.show()
        figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
            np.random.randint(1000, 9999))
        plt.savefig(figurepath)
        plt.close()
        return figurepath

    def figure_fft_average(self):
        # raw_time, raw_data, spectrum_size, overlap, weighting
        # zz2 = figure_fft_average(raw_time, raw_data, 16384, 75, 1)
        (f, db) = self.fft_average()
        plt.figure()
        plt.plot(f, db)
        plt.xscale('log')
        plt.xlim(10, 20000)
        plt.xlabel('fs/Hz')
        plt.ylabel('dB(A)')
        plt.grid(b=bool, which='both')
        plt.title('fft average')
        plt.tight_layout()
        plt.show()
        figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
            np.random.randint(1000, 9999))
        plt.savefig(figurepath)
        plt.close()
        return figurepath

    def figure_fft_time(self):
        # raw_time, raw_data, spectrum_size, overlap, weighting
        (f, ta, pm) = self.fft_time()
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

    def figure_fft_rpm(self):
        # raw_time, raw_data, raw_rpm, rpm_step, rpmtype, spectrum_size, weighting
        (f, rpml, pm) = self.fft_rpm()  # raw_time, raw_data, raw_rpm, rpm_step, rpmtype, spectrum_size, fs, weighting
        x2, y2 = np.meshgrid(rpml, f)
        levels = MaxNLocator(nbins=50).tick_values(pm.min(), pm.max())
        fig, ax = plt.subplots()
        cf = ax.contourf(x2, y2, pm, levels=levels)
        ax.set_yscale('log')
        ax.set_ylim(20, 16000)
        fig.colorbar(cf, ax=ax)
        ax.set_title('contourf for fft versus rpm')
        fig.tight_layout()
        plt.show()
        figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
            np.random.randint(1000, 9999))
        plt.savefig(figurepath)
        plt.close()
        return figurepath

    def figure_octave_fft(self):  # raw_time, raw_data, spectrum_size, overlap, weighting
        (fc, db) = self.octave_fft()  # raw_data, spectrum_size, fs, overlap, weighting
        plt.figure()
        ind = np.arange(len(fc))
        plt.bar(ind, db)
        plt.xticks(ind, ['31.5', '63', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'])
        plt.grid(b=bool, which='both', axis='y')
        plt.xlabel('fs/Hz')
        plt.ylabel('db(A)')
        plt.title('Octave fft 16384')
        plt.tight_layout()
        plt.show()
        figurepath = absolute_dir + 'f' + time.strftime("%Y%m%d%H%M%S", time.localtime()) + str(
            np.random.randint(1000, 9999))
        plt.savefig(figurepath)
        plt.close()
        return figurepath

    def figure_order_vfft(
            self):  # raw_time, raw_data, raw_rpm, rpm_step, rpmtype, order, orderResolution, orderWidth, smoothFrac
        (rpml,
         dbo) = self.order_vfft()  # raw_time, raw_data, raw_rpm, rpm_step, rpmtype, order, orderResolution, orderWidth, smoothFrac
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

    def figure_level_time(self):  # raw_time, raw_data, timeWeighting, A
        lpa = self.level_time()  # raw_time, raw_data, timeWeighting, A
        plt.figure()
        plt.plot(self.raw_time, lpa)
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

    def figure_level_rpm(self):  # raw_time, raw_data, raw_rpm, rpm_step, rpmtype, timeWeighting, A
        self.timeWeighting = 1  # 初始化timeWeighting
        (rpml, lpr) = self.level_rpm()  # raw_time, raw_data, raw_rpm, rpm_step, rpmtype, timeWeighting, A
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


a = Calculate()
a.figure_level_rpm()
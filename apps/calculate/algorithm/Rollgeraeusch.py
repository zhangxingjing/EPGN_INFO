# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author    : Zheng Xingtao
# File      : Rollgeraeusch.py
# Datetime  : 2020/5/26 下午1:54


import re
import os
import xlrd
import time
import h5py
import pymysql
import librosa
import numpy as np
from xlutils.copy import copy
from scipy.fftpack import fft
import matplotlib.pyplot as plt
from scipy.signal.windows import hann
from multiprocessing import cpu_count, Pool, Manager

epsilon = 1e-5
CalculateNameDict = {
    "(N)G3 VZ": "LevelVsRpm",
    "(N)G3 VS": "OrderVsVfft",
    "(N)G5 VZ": "LevelVsRpm",
    "FFT": "FftCalculate",
    "KP 80-20": "FftCalculate",
    "Start Stop": "StartStop",  # 启停算法
    "Level VS RPM": "LevelVsRpm",
    "Level VS Time": "LevelVsTime",
    "2nd Order VS RPM": "OrderVsVfft",
}
REFERENCE_CHANNEL = ["time", "data_EngineRPM", "data_EngineCoolantTemp", "data_VehicleSpeed"]


class ParseTask(object):
    """
    Note：这部分有两个部分
        1. IO密集：读取文件信息（多线程），把所有的IO写在一个函数里
        2. CPU密集：算法计算（多进程）
    """

    def __init__(self, item, rpm_type):
        self.item = item
        self.rpm_type = rpm_type
        self.queue = Manager().Queue()

    def parse_json(self):
        # 使用yield完成多协程的IO操作
        calculate_name = self.item["calculate"]  # 算法名称
        channel_info_list = self.item["file_info"]["children"]  # 前端发送的文件列表数据（一级列表）
        calculate_class_name = calculate_name  # 将算法名称传递到工厂模式中 ==> 拿到当前算法中的类名
        for info_dict in channel_info_list:
            filename = info_dict["title"]
            channel_front_list = info_dict["children"]  # 二级列表
            channel_file_info, channel_data = read_hdf(filename)
            yield channel_file_info, channel_front_list, calculate_class_name, filename, channel_data

    def parse_file_info(self):
        pool = Pool(cpu_count())
        # 计算: 使用多进程完成CPU密集型
        for channel_file_list, channel_front_list, calculate_class_name, filename, channel_data in self.parse_json():
            for channel in channel_front_list:
                if channel['title'] in ["EngineRPM"]:
                    channel_front_list.remove(channel)
            for channel in channel_front_list:
                # time_key
                channel_time = list(channel_file_list.keys())[list(channel_file_list.values()).index("time")]
                channel_time_num = re.match(r'.*?(\d+)', channel_time).group(1)

                # data_key
                channel_data_key = list(channel_file_list.keys())[
                    list(channel_file_list.values()).index(channel["title"])]
                channel_data_num = re.match(r'.*?(\d+)', channel_data_key).group(1)
                try:
                    # rpm_key
                    channel_rpm = list(channel_file_list.keys())[list(channel_file_list.values()).index("EngineRPM")]
                    channel_rpm_num = re.match(r'.*?(\d+)', channel_rpm).group(1)
                except:
                    channel_rpm_num = 5

                """异步返回 ==> 使用队列接受多进程中的数据返回值"""
                pool.apply_async(
                    self.calculate_process, args=(
                        self.queue,
                        calculate_class_name,
                        filename,
                        channel_data,
                        self.rpm_type,
                        channel["title"],
                        int(channel_time_num) - 1,  # time
                        int(channel_data_num) - 1,  # data
                        channel_rpm_num,  # rpm
                    )
                )
        pool.close()
        pool.join()

    def calculate_process(self, queue, calculate_class_name, file_name, channel_data, rpm_type, channel_name,
                          raw_time_num, raw_data_num, raw_rpm_num):
        # 返回item
        try:
            X, Y = FftCalculate(file_name, channel_data, rpm_type, channel_name, raw_time_num, raw_data_num,
                                raw_rpm_num).run()
            queue.put({"filename": file_name, "data": {"X": X, "Y": Y}, "channel": channel_name})
        except:
            pass  # print("ParseTask >> calculate_process() 计算出错！")

    def run(self):
        # 使用进程间通信 返回多个数据的返回
        items = []
        self.parse_file_info()
        while True:
            if self.queue.empty():
                break
            items.append(self.queue.get())
        return items


def read_hdf(file_path):
    """
    读取 HDF 文件
    :param file_path: 需要读取的文件路径
    :return: 当前文件中的所有数据
    """
    file_path = file_path
    read_info = h5py.File(file_path, 'r')
    items = []
    channel_dict = {}
    i = 1
    for key in read_info.keys():
        items.append(read_info[key][:])
        channel_dict["Channel " + str(i)] = key
        i += 1
    return channel_dict, items


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
        self.raw_rpm = None
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
        path = os.path.join(os.path.dirname(os.path.dirname("/"))) + "/epgn_front_end/calculate_image/"
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
        pa = (ff2rs / self.fs / self.timeWeighting) ** 0.5
        lpa = 20 * np.log10(pa / 2e-5 + epsilon)
        return raw_data, lpa


class OederVfft(Calculate_Object):
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


# FFT
class FftCalculate(FftInfo):
    def run(self):
        f, db = self.fft_average()
        return f, db


# 所有FFT的区间取值
class Rollgeraeusch():
    def __init__(self):
        # class初始化
        self.conn = pymysql.connect(
            host="127.0.0.1",
            port=3306,
            user="root",
            password="root",
            database="EPGN_INFO",
            charset="utf8"
        )
        self.cursor = self.conn.cursor()  # 得到一个可以执行SQL语句的光标对象
        self.FILE_READ_PATH = "/home/zheng/Documents/WorkFile/R_HDF/"
        self.excel_path = '/home/zheng/Desktop/KP80-20.xls'

    def get_data(self):
        # 从MySQL中获取数据信息
        try:
            sql = "select * from tb_car where status='KP 80-20'"
            self.cursor.execute(sql)
            results = self.cursor.fetchall()
        except:
            return None
        items = []
        for result in results:
            item = {
                "filename": result[12],
                "status": result[6],
                "car_model": result[3],
                "car_number": result[8],
                "produce": result[3],
            }
            items.append(item)
        return items

    def calculate(self, item):
        # 将文件名传入算法，获取算法结果
        rpm_type = "falling"
        return_items = []

        file_path = self.FILE_READ_PATH + item["filename"]
        channel_dict, channel_data = read_hdf(file_path)
        channel_calculate_list = [i for i in channel_dict.values() if i not in REFERENCE_CHANNEL]  # 去除参考通道
        i = 1
        children_list = []
        for channel in channel_calculate_list:
            children_list.append({"id": i, "title": channel})
            i += 1
        data = {
            "calculate": "FFT",
            "file_info": {
                "checked": "True",
                "children": [
                    {
                        "children": children_list,
                        "id": 1,
                        "title": file_path
                    },
                ],
                "field": "name1",
                "id": 1,
                "spread": "True",
                "title": "文件夹名"
            }
        }
        results = ParseTask(data, rpm_type).run()  # len(result) =0
        for result in results:
            x_list = list(result["data"]["X"])
            y_list = list(result["data"]["Y"])
            line_loc = []
            for x, y in zip(x_list, y_list):
                point_loc = []
                try:  # 当我们使用的算法是FFT的时候，需要对算法返回只进行log处理
                    point_loc.append(x)
                except:
                    continue
                point_loc.append(y)
                line_loc.append(point_loc)
            result["data"] = line_loc
            return_items.append(result)
        return return_items

    def get_max(self, items):
        # 获取指定位置的最大值
        y_list = []
        for item in items["data"]:
            if 240 > item[0] >= 180:
                y_list.append(item[1])
        max_x_y = [i for i in items["data"] if max(y_list) in i]
        return max_x_y[0]

    def save_excel(self, item, row):
        # 保存为excel
        workbook = xlrd.open_workbook('/home/zheng/Desktop/KP80-20.xls', formatting_info=True)
        copy_workbook = copy(workbook)
        sheet = copy_workbook.get_sheet(0)
        sheet.write(row, 0, item["car_model"])
        sheet.write(row, 1, item["car_number"])
        sheet.write(row, 2, item["produce"])
        sheet.write(row, 3, item["data"]["data_vorn rechits"][1])
        sheet.write(row, 4, item["data"]["data_vorn links"][1])
        sheet.write(row, 5, item["data"]["data_hinten rechits"][1])
        sheet.write(row, 6, item["data"]["data_hinten links"][1])
        copy_workbook.save('/home/zheng/Desktop/KP80-20.xls')

    def data_plt(self):
        # 数据可视化
        pass

    def run(self):
        # 主函数
        items = self.get_data()
        if items is not None:
            row = 1  # 行 随文件名列表变化
            for item in items:
                return_items = self.calculate(item)
                excel_info = {}
                excel_info["data"] = {}
                for return_item in return_items:
                    item["channel"] = return_item["channel"]
                    item["max_x_y"] = self.get_max(return_item)

                    excel_info["car_model"] = item["car_model"]
                    excel_info["car_number"] = item["car_number"]
                    excel_info["produce"] = item["produce"]
                    excel_info["data"].update({item["channel"]: list(item["max_x_y"])})
                self.save_excel(excel_info, row)
                row += 1


if __name__ == '__main__':
    Rollgeraeusch().run()

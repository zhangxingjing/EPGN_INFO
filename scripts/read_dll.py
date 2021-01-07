#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# FileName ：read_dll.py
# Author   ：zheng xingtao
# Date     ：2021/1/4 10:59

import os
import re
import sys
import clr
import h5py
import numpy as np
from datetime import datetime
from multiprocessing import Pool, cpu_count

import pymysql
import requests

sys.path.append("C:\\Program Files (x86)\\HEAD ArtemiS SUITE 11.0")
clr.FindAssembly('HEADacoustics.API.Hdf.dll')
from HEADacoustics.API.Hdf import *

hdf_file_path = "Y:\\Database\\H_HDF\\"
save_path = "Y:\\Database\\R_HDF\\"

url = "http://172.26.209.199:8000/file_status/"


# StartTime = datetime.now()
# print(StartTime)


class ParseHDFFILE(object):
    def __init__(self, file_path):
        self.license = License.Create()
        self.chs = StreamReader.Create(file_path).GetChannels()

    # 获取每个channel的数据
    def get_nth_channel(self):
        for cb in range(self.chs.Length):
            channel_name = self.chs[cb].ChannelInfo.Name  # 通道名
            n_frames = self.chs[cb].NumberOfSamples  # 获取样本数量
            data_single = self.chs[cb].GetData(0, n_frames)
            data_ = []

            # get data
            for i in range(0, n_frames, 1):
                data_.append(data_single[i])
            data_ = np.float64(data_)  # 把数据 经float转换类型后，存放到data_中

            # 横坐标--时间
            time_abscissa = self.chs[0].EquidistantAbscissa
            time_ = np.arange(
                time_abscissa.FirstValue,
                time_abscissa.LastValue + time_abscissa.DeltaValue,
                time_abscissa.DeltaValue
            )
            yield channel_name, time_, data_

    # 把数据转存为可读HDF
    def save_hdf(self, i, filename, channel_name, time_, data_):
        try:
            save_file = h5py.File(save_path + filename, 'a')
            # save_file['data' + "_" + channel_name] = data_
            save_file[channel_name] = data_
            if i < 2:
                save_file['time'] = time_

        except FileExistsError as e:
            print(e)

    # 读取HDF文件
    def read_hdf(self):
        read_file = h5py.File(save_path, 'r')
        for key in read_file.keys():
            print(read_file[key].name, read_file[key].shape, read_file[key].value)


class HDFtoReadHDF(object):
    """
    将当前文件夹中： 新增 的HDF文件转换成 可读HDF 文件
    """

    def __init__(self):
        self.path = "Y:\\Database\\H_HDF\\"

    # 获取当前文件夹中的文件个数
    def get_path_lth(self):
        hdf_file_list = []
        file_list = os.listdir(self.path)
        for file in file_list:
            # if os.path.isfile(file):    # 判断是不是一个文件 ==> 是hdf文件，肯定不是文件家
            if os.path.splitext(file)[1] == ".hdf":  # 判断是不是 .hdf 文件
                hdf_file_list.append(self.path + file)
        return hdf_file_list

    # 拿到指定的HDF文件，将其转换为可读HDF文件
    def change_file(self, new_file_list):
        # for i in new_file_list:
        #     print("文件夹发生改变，新增了: {}".format(i))

        start_process(new_file_list)

    # 函数入口
    def run(self):
        hdf_file_list = self.get_path_lth()
        while True:
            new_hdf_file_list = self.get_path_lth()
            # print(len(new_hdf_file_list), len(hdf_file_list))

            if len(new_hdf_file_list) > len(hdf_file_list):
                global StartTime
                StartTime = datetime.now()
                print(StartTime)
                print(len(new_hdf_file_list), len(hdf_file_list), "文件发生了变化！")
                new_file_list = [i for i in new_hdf_file_list if i not in hdf_file_list]
                self.change_file(new_file_list)
            hdf_file_list = new_hdf_file_list


# 单个进程需要执行的代码
def process_file(current_file_path):
    parse_file = ParseHDFFILE(current_file_path)
    filename = re.match(r'Y:\\Database\\H_HDF\\(.*\.hdf)', current_file_path).group(1)
    i = 1
    for channel_name, time, data in parse_file.get_nth_channel():
        new_channel_name = python_sql(channel_name)
        parse_file.save_hdf(i, filename, new_channel_name, time, data)  # 存储数据
        i += 1
    requests.get(url, params={"file": filename})
    print("{} 转换完成！".format(save_path + filename), "*" * 20, filename)
    # EndTime = datetime.now()
    # print("EndTime: ", EndTime - StartTime)

    # 读取数据
    # parse_file.read_hdf()


# 从LinuxServer中获取指定文件名的通道信息
def python_sql(old_channel_name):
    """
    用户上传数据的时候，将匹配的通道信息写入后台
    后台转换文件的同时，同时替换刻度HDF文件中的通道信息
    """
    conn = pymysql.connect(host="172.26.209.199", port=3306, user="root", password="spider", database="EPGN_INFO", charset="utf8")
    cursor = conn.cursor()  # 得到一个可以执行SQL语句的光标对象

    print(old_channel_name)

    sql = "select * from tb_channel where name='{}';".format(old_channel_name)  # 要执行的SQL语句

    channelName = ""
    try:
        cursor.execute(sql)  # 执行SQL语句
        results = cursor.fetchall()

        if len(results) == 0:
            """
            用户上传文件之后，未修改通道
            在这里查询数据，没有数据==>处理延迟

            未查询到通道信息，--->不转换文件！
            """
            print("当前通道不存在，请检查！")
            return

        # print(results[0])
        if results[0][2] is None:
            channelName = results[0][1]
        else:
            channel_parent_id = results[0][2]
            sql = "select * from tb_channel where id={};".format(channel_parent_id)
            try:
                cursor.execute(sql)  # 执行SQL语句
                results = cursor.fetchall()
                channelName = results[0][1]
            except pymysql.DatabaseError as data_error:
                print(data_error)

        cursor.close()  # 关闭光标对象
        conn.close()  # 关闭数据库连接
    except pymysql.DatabaseError as data_error:
        print(data_error)

    # print("ChannelName: ", channelName)
    return channelName


# 开启进程池
def start_process(file_list):
    # print(os.getpid(), cpu_count())
    pool = Pool(cpu_count())
    for current_file_path in file_list:
        pool.apply_async(process_file, args=(current_file_path,))
    pool.close()
    pool.join()


# 获取指定路径下的全部文件列表
if __name__ == '__main__':
    # file_list = os.listdir(hdf_file_path)
    HDFtoReadHDF().run()

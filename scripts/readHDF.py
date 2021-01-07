# !/usr/bin/env python
# -*- coding: UTF-8 -*-
# Author   ：zheng xingtao


import h5py

from settings.dev import FILE_READ_PATH


def read_hdf(file_name):
    """
    读取 HDF 文件
    :param file_name: 读取的文件名
    :return: 当前文件中的所有数据
    """
    file_path = FILE_READ_PATH + file_name

    print(file_path)

    read_info = h5py.File(file_path, 'r')
    items = []
    channel_dict = {}
    i = 1
    for key in read_info.keys():
        items.append(read_info[key][:])
        channel_dict["Channel " + str(i)] = key
        i += 1
    print(channel_dict, items)
    return channel_dict, items

#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# FileName ：readHDF.py
# Author   ：zheng xingtao
# Date     ：2021/1/7 16:38


from ctypes import *

import pytdms


def read_file(filepath):
    """
    read hdf_file info
    :param filepath: hdf file path
    :return: file info
    """
    hdf_path = filepath.encode(encoding="utf-8")
    dll_info = CDLL("./tdms_convert_dll_try.dll")

    len_ifn = len(hdf_path)
    ifn = create_string_buffer(len_ifn)
    ifn.raw = hdf_path
    ofn = create_string_buffer(256)
    dll_info.DLL_tdms_convert_try(ifn, ofn, 256)
    return pytdms.read(ofn.value)


file_path = "Test1.hdf"

# TODO: 返回值皆为二进制字典
attribution, rawdata = read_file(file_path)

print(attribution.keys(), rawdata.keys())

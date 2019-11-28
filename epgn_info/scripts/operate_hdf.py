"""
操作HDF5文件


import h5py
import numpy as np

# write
imgData = np.zeros((30, 3))
with h5py.File('HDF5_FILE.h5', 'w') as f:
    # f['data'] = imgData  # 将数据写入文件的主键data下面
    # f['labels'] = range(100)  # 将数据写入文件的主键labels下面
    f.create_dataset('data', data=imgData)
    f.create_dataset('labels', data=range(100))

# read
with h5py.File('HDF5_FILE.h5', 'r') as f:
    for item in f.keys():
        print(f["data"][:])
        print("main key is : {}".format(item))
        content = f[item][:]
        print("key value pf {0} is : {1}".format(item, content))
"""
import json

"""
提取asc数据
"""
import h5py
import numpy as np


class ExtractData():
    def __init__(self):
        self.key = "array_key"
        self.file_name = "operate_hdf.txt"
        self.file_path = "/home/zheng/Documents/EPGN/700004 ( 0.00-30.00 s).asc"

    def read_file_num(self, file_name):
        items = []
        data_content = ""
        split_tag = ' '  # 编码不同的时候，使用不同的读取方式
        file = open(file_name, "r", encoding="gbk", errors="ignore")

        while True:
            file_content = file.readline()
            if not file_content:
                break
            if not file_content[0].isdigit():
                continue
            if file_content[0].isdigit():
                data_content += file_content

        content_line_list = data_content.split('\n')
        if len(content_line_list[0].split(
                split_tag)) == 0:
            split_tag = '\t'
        for read_line in content_line_list:
            content_list = read_line.split(split_tag)
            item = []
            for contents in content_list:
                try:
                    item.append(float(contents))
                except:
                    continue
            items.append(item)
        if len(items[-1]) != 0:
            return items
        items_array = np.array(items[:-1])
        return items_array

    def write_hdf(self, data):
        with h5py.File(self.file_name, 'w') as f:
            f.create_dataset("array_key", data=data)
        # np.savetxt(self.file_name, data, delimiter=' ')

    def run(self):
        items_array = self.read_file_num(self.file_path)
        print(items_array[:, 0])
        print(items_array.shape)
        self.write_hdf(items_array[:, 0])

    def read_hdf(self):
        with h5py.File(self.file_name, 'r') as f:
            item = f[self.key][:]
            print(item)
            print(item.shape)
        # with open(self.file_name, 'r') as f:
        #     print("我是从文件里面读出来的数据哦！")


extrac = ExtractData()
extrac.run()

import time

# 读取计时
time_start = time.time()
extrac.read_hdf()
print('time cost', time.time() - time_start, 's')

"""
修改自定义工况-逻辑

添加变速箱信息：
    1. 重建本地数据库
        1.1 页面从数据库获取变速箱信息
    2. 修改文件信息表--增加变速箱
    3. 修改文件上传函数
        3.1 接收参数
        3.2 写入数据库
"""

# 增加文件状态
import os

from settings.dev import FILE_HEAD_PATH, FILE_READ_PATH


def file_current_status():
    new_filename_list = os.listdir(FILE_READ_PATH)
    for file_name in new_filename_list:
        print(file_name)
        # file = Fileinfo.objects.filter(filename=file_name)
        if file_name == 0:
            print(1)
            # file.file_status = 1  # 转化中
        # 不停地对文件的状态进行校验
        try:
            print(2)
            # channel_dict, items = read_hdf(file_name)
            # file.file_status = 2  # 转化完成
        except FileExistsError:
            # file.file_status = 0  # 未转化
            print(0)
        # file.save()

file_current_status()
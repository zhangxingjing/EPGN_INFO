import os
import re
from epgn_info.apps.calculate.algorithm.class_calculate import *
from apps.calculate.algorithm.calculate_name import CalculateNameDict


def read_file_header(file_path):
    """
    # 读取指定文件中的通道信息
    :param file_name:
    :return:
    """
    head_content = ""
    file = open(file_path, "r", encoding="gbk", errors="ignore")
    while True:
        file_content = file.readline()
        if not file_content:
            break
        if not file_content[0].isdigit():  # 如果当前行是字母开头，就用data保存
            head_content += file_content
        elif file_content[0].isdigit():
            break

    # 处理头文件中的channel字典
    try:
        header_info = re.match(r"(.*?)\[CodedChannel0](.*?)\[Channel\d](.*)", head_content, re.S).group(1)
    except AttributeError as error:
        header_info = re.match(r"(.*?)(Channel 1.*?)Comment", head_content, re.S).group(2)
    detail_key_list = []
    detail_value_list = []
    channel_dict = {}
    head_channel_info = re.findall(r'(Channel \d+:	.*?),', header_info, re.S)
    for head_channel in head_channel_info:
        key = re.search(r"(.*):", head_channel, re.S).group(1).strip()
        value = re.search(r":(.*)", head_channel, re.S).group(1).strip()
        detail_key_list.append(key)
        detail_value_list.append(value)
    for key, value in zip(detail_key_list, detail_value_list):
        channel_dict[key] = value
    return channel_dict


class FileArrayInfo():
    def __init__(self):
        self.file_home = "/home/zheng/Documents/EPGN"

    def get_file_list(self, dir_path):
        # 获取当前所有文件绝对路径
        all_file_list = os.listdir(self.file_home)
        for file_name in all_file_list:
            path_info = os.path.join(dir_path, file_name)  # 遍历拼接文件路径
            if os.path.isfile(path_info):
                yield path_info

    # def parse_file_info(self, file_path):
    #     # 获取单个文件不同通道在不同算法中的计算结果
    #     file_channel_dict = read_file_header(file_path)
    #     return file_channel_dict

    def run(self, dir_path):
        """
        1. 获取文件存储位置的所有文件绝对路径
        2. 对于单个文件进行数据处理
            2.1 读取当前文件中的通道信息，使用不同算法计算其结果
            2.2 将算法计算结果保存到指定的文件（或数据库中）
        """
        for file_path in self.get_file_list(dir_path):
            dict_info = read_file_header(file_path)

            # 如果再上一个循环里面直接就删除了这个RPM，在字典里面就没有这个键值对了
            one_file_dict = {}
            for key, value in dict_info.items():
                RPM_NUM = list(dict_info.values()).index('EngineRPM')
                if value not in ["EngineRPM"]:
                    num = re.match(r'.*?(\d+)', key).group(1)
                    print(num, "==>", value)
                    for calculate_class_name in CalculateNameDict.values():
                        a = eval(calculate_class_name)(file_path, 0, key, RPM_NUM).run()    # 这里返回的是一张图片
                        print(a)
                        break
                break
            break   # 针对单个文件

file_info = FileArrayInfo()
file_info.run("/home/zheng/Documents/EPGN")

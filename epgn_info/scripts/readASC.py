import re
import numpy as np
from time import time
from epgn_info.epgn_info.settings.devp import FILE_SAVE_PATH

def read_file_header(file_name):
    head_content = ""
    file_path = FILE_SAVE_PATH + file_name
    file = open(file_path, "r", encoding="gbk", errors="ignore")
    while True:
        file_content = file.readline()
        if not file_content:
            break
        if not file_content[0].isdigit():
            head_content += file_content
        elif file_content[0].isdigit():
            break

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


def read_file_num(file_name):
    items = []
    data_content = ""
    split_tag = '\t'  # 编码不同的时候，使用不同的读取方式
    file_path = FILE_SAVE_PATH + file_name
    file = open(file_path, "r", encoding="gbk", errors="ignore")

    while True:
        file_content = file.readline()
        if not file_content:
            break
        if not file_content[0].isdigit():
            continue
        if file_content[0].isdigit():
            data_content += file_content

    content_line_list = data_content.split('\n')
    if len(content_line_list[0].split(split_tag)) == 0:
        split_tag = ' '
    for read_line in content_line_list:
        content_list = read_line.split(split_tag)
        item = []
        for contents in content_list:
            try:
                item.append(float(contents))
            except:
                continue
        items.append(item)
    # return items
    # if len(items[-1]) != 0:
    #     return items
    items_array = np.array(items[:-1])
    return items_array


def read_asc(file_name):
    # 同时读取当前文件的头文件和数据
    items = []
    head_content = ""
    data_content = ""
    split_tag = '\t'  # 编码不同的时候，使用不同的读取方式
    file_path = FILE_SAVE_PATH + file_name
    file = open(file_path, "r", encoding="gbk", errors="ignore")
    while True:
        file_content = file.readline()
        if not file_content:
            break
        if not file_content[0].isdigit():
            head_content += file_content
        elif file_content[0].isdigit():
            data_content += file_content
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

    content_line_list = data_content.split('\n')
    if len(content_line_list[0].split(split_tag)) == 0:
        split_tag = ' '

    for read_line in content_line_list:
        content_list = read_line.split(split_tag)
        item = []
        for contents in content_list:
            try:
                item.append(float(contents))
            except:
                continue
        items.append(item)

    items_array = np.array(items[:-1])
    return channel_dict, items_array


"""代码的执行顺序"""
# start_time = time()
# FileSavePath = "/home/zheng/Desktop/demo/"
# channel_dict, items_array = read_asc('ASC码数据.asc')
# print(channel_dict, items_array)  # asc数据
# print(time() - start_time)  # 读取时间

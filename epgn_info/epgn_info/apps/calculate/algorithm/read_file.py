import re
import numpy as np
from epgn_info.settings.devp import FileSavePath
# from epgn_info.epgn_info.settings.prod import FileSavePath


def read_file_header(file_name):
    """
    # read channel information in the specified file
    :param file_name: we can add filepath to filename front ==> filepath + filename
    :return:
    """
    head_content = ""
    file_path = FileSavePath + file_name
    file = open(file_path, "r", encoding="gbk", errors="ignore")
    while True:
        file_content = file.readline()
        if not file_content:
            break
        if not file_content[0].isdigit():  # if the current line is the beginning of a letter, save it with data
            head_content += file_content
        elif file_content[0].isdigit():
            break

    # handing channel dictionary in the header file
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
    """
    read file array data
    :param file_name:
    :return:
    """
    items = []
    data_content = ""
    split_tag = ' ' # 编码不同的时候，使用不同的读取方式
    # file_path = FileSavePath + file_name + '.asc'
    file_path = FileSavePath + file_name
    file = open(file_path, "r", encoding="gbk", errors="ignore")

    while True:
        file_content = file.readline()
        if not file_content:
            break
        if not file_content[0].isdigit():
            continue
        if file_content[0].isdigit():  # if the current line is the beginning of number，save it with data
            data_content += file_content

    # processing the collected data in the header file
    content_line_list = data_content.split('\n')  # get each line of
    if len(content_line_list[0].split(split_tag)) == 0:  # if the list obtained by thr first row value is incorrect, change the separator  ==> 9
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
    if len(items[-1]) != 0:  # if there is no value in the last list in the list, return directly
        return items
    items_array = np.array(items[:-1])
    return items_array

# channel_dict = read_file_header('/home/spider/Music/asc/guan2019-08-14_100001 ( 0.00-12.63 s).asc')
# print(channel_dict)
# print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))

# items = read_file_num('/home/spider/Music/大众/EPGN_INGO/100001 ( 0.00-12.63 s).asc')
# print(items)

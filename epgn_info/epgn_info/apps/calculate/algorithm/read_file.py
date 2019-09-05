import re
import numpy as np

def read_file_header(file_name):
    """
    # 读取指定文件中的通道信息
    :param file_name:
    :return:
    """
    # print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))
    head_content = ""
    # file_path = '/home/spider/Music/大众/EPGN_INGO/' + file_name + '.asc'
    file = open(file_name, "r", encoding="gbk", errors="ignore")
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


def read_file_num(file_name):
    """
    读取文件数组数据
    :param file_name:
    :return:
    """
    items = []
    data_content = ""
    split_tag = ' '  # # 编码不同的时候，使用不同的读取方式
    file_path = '/home/spider/Music/大众/EPGN_INGO/' + file_name + '.asc'
    file = open(file_path, "r", encoding="gbk", errors="ignore")

    while True:
        file_content = file.readline()
        if not file_content:
            break
        if not file_content[0].isdigit():
            continue
        if file_content[0].isdigit():  # 如果当前行是数字开头，就用data保存
            data_content += file_content

    # 处理头文件中的采集数据
    content_line_list = data_content.split('\n')  # 以换行获取每行数据，放入列表
    if len(content_line_list[0].split(split_tag)) == 0:  # 如果第一行取值获得的列表不正确，就换别的分隔符  ==> 9
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
    if len(items[-1]) != 0:  # 如果列表中最后一个列表中没有值，直接返回
        return items
    items_array = np.array(items[:-1])
    return items_array

# channel_dict = read_file_header('/home/spider/Music/asc/guan2019-08-14_100001 ( 0.00-12.63 s).asc')
# print(channel_dict)
# print(time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())))

# items = read_file_num('/home/spider/Music/大众/EPGN_INGO/100001 ( 0.00-12.63 s).asc')
# print(items)

import numpy as np


def read_asc_file(file_path):  # head_content needs to be completed
    head_content = ""
    data_content = ""
    fileRead = open(file_path, 'r', encoding='gbk')
    while True:
        file_content = fileRead.readline()
        if not file_content:
            break
        if not file_content[0].isdigit():  # if begin with str
            head_content += file_content
        elif file_content[0].isdigit():  # if begin with num
            data_content += file_content
    content_line_list = data_content.split('\n')  # devide data_content by '\n'


    datas = []
    for read_line in content_line_list:
        content_list = read_line.split('\t')
        items = []
        for contents in content_list:
            # print(contents)
            try:
                items.append(float(contents))
            except Exception as error:
                print(error)
                continue
        datas.append(items)

    datas = datas[:-1]
    data_matrix = np.array(datas)
    return data_matrix


np_data = read_asc_file("/home/spider/Music/大众/file/Practice_Data/F2 trotte run01 ( 0.00- 3.60 s).asc")
print(np.shape(np_data))
raw_data = np_data[:,1]
print(np.shape(raw_data))
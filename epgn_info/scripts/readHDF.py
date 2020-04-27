import h5py

from epgn_info.epgn_info.settings.devp import FILE_HEAD_PATH, FILE_READ_PATH    # Nginx
# from epgn_info.settings.devp import FILE_HEAD_PATH  # manage
# FILE_SAVE_PATH = "/home/zheng/Desktop/.demo/R_HDF/"


def read_hdf(file_name):
    """
    这里读取的应该是 HDF文件
    :param file_name: 读取的文件名
    :return: 当前文件中的所有数据
    """
    file_path = FILE_HEAD_PATH + file_name
    read_info = h5py.File(file_path, 'r')
    items = []
    channel_dict = {}
    i = 1
    for key in read_info.keys():
        items.append(read_info[key].value)
        channel_dict["Channel " + str(i)] = key

        # print(key, read_info[key].value)

        # if read_info[key].name == "/time":
        #     channel_dict["Channel " + str(i)] = "time"
        # else:
        #     channel_dict["Channel " + str(i)] = re.match(r'/data_(.*)', read_info[key].name).group(1)
        # print(i, read_info[key].name, read_info[key].shape, read_info[key].value)

        i += 1
    return channel_dict, items


"""代码执行顺序"""
# start_time = time()
# channel_dict, items = read_hdf('2020-04-09_kp 80-20 run03.hdf')
# print(channel_dict)  # 打印HDF数据
# print("raw_time:", items[5])
# print("raw_data:", items[1])
# print("raw_rpm:", items[0])
# print(time() - start_time)  # 读取时间

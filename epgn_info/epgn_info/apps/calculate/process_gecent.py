import re
from .algorithm.class_calcuate import *
from .algorithm.read_file import read_file
from multiprocessing import cpu_count, Pool, Manager
from .algorithm.calculate_name import CalculateNameDict


# 测试数据
# item = {
#     "calculate": "FFT",
#     "file_info": {
#         "checked": "True",
#         "children": [
#             {
#                 "children": [{"id": 2, "title": "EngineRPM"}, {"id": 2, "title": "HR"}],
#                 "id": 1,
#                 "title": "2019-12-04_Ausgang F3 VZ run04 ( 0.00- 9.66 s).asc"
#                 # "title": "F3 VZ run4 ( 0.00-52.41 s).asc"
#             },{
#                 "children": [{"id": 2, "title": "EngineRPM"}, {"id": 2, "title": "HR"}],
#                 "id": 1,
#                 "title": "2019-12-04_Ausgang F3 VZ run04 ( 0.00- 9.66 s).asc"
#                 # "title": "F3 VZ run4 ( 0.00-52.41 s).asc"
#             }
#         ],
#         "field": "name1",
#         "id": 1,
#         "spread": "True",
#         "title": "文件夹名"
#     }
# }


class ParseTask():
    """
    Note：这部分有两个部分（一个一个实现）
        1. IO密集：读取文件信息（多线程），把所有的IO写在一个函数里
        2. CPU密集：算法计算（多进程）
    """

    def __init__(self, item):
        self.item = item
        self.queue = Manager().Queue()

    def parse_json(self):
        # 使用yield完成多协程的IO操作
        calculate_name = self.item["calculate"]  # 算法名称
        channel_info_list = self.item["file_info"]["children"]  # 前端发送的文件列表数据（一级列表）
        calculate_class_name = CalculateNameDict[calculate_name]  # 将算法名称传递到工厂模式中 ==> 拿到当前算法中的类名

        for info_dict in channel_info_list:
            filename = info_dict["title"]
            channel_front_list = info_dict["children"]  # 二级列表

            # 读文件的时候就要切换线程 ==> 就在当前进程中切换 ==> 协程
            channel_file_info, channel_data = read_file(filename)
            yield channel_file_info, channel_front_list, calculate_class_name, filename, channel_data

    def parse_file_info(self):
        pool = Pool(cpu_count())
        # queue = Manager().Queue()
        # 计算的时候使用多进程完成CPU密集型
        for channel_file_list, channel_front_list, calculate_class_name, filename, channel_data in self.parse_json():

            channel_location = {}
            for channel in channel_front_list:
                if channel['title'] in ["EngineRPM"]:
                    # if channel['title'] in ["RPM"]:
                    channel_front_list.remove(channel)
                channel_key = list(channel_file_list.keys())[list(channel_file_list.values()).index(channel["title"])]
                channel_key_num = re.match(r'.*?(\d+)', channel_key).group(1)
                channel_location[channel["title"]] = int(channel_key_num)

                """异步返回"""
                # 使用队列接受多进程中的数据返回值
                pool.apply_async(self.calculate_process, args=(
                    self.queue,
                    calculate_class_name,
                    filename,
                    channel_data,
                    channel["title"],
                    int(0),
                    int(channel_location[channel["title"]]),
                    int(channel_location["EngineRPM"]),
                ))
        pool.close()
        pool.join()

    def calculate_process(self, queue, calculate_class_name, file_name, channel_data, channel_name, raw_time_num,
                          raw_data_num, raw_rpm_num):
        print(calculate_class_name, os.getpid())
        # img_path = eval(calculate_class_name)(
        #     file_name,
        #     channel_data,
        #     channel_name,
        #     raw_time_num,
        #     raw_data_num,
        #     raw_rpm_num
        # ).run()
        # img_path = re.match(r'.*?(/epgn_front_end/calculate_image/.*)', img_path).group(1)

        # 这里确定返回到前端的数据
        data = {"asd": 12, "qwe": 32}
        queue.put(data)

    def run(self):
        # 使用进程间通信 返回多个数据的返回
        items = []
        self.parse_file_info()
        while True:
            if self.queue.empty():
                break
            items.append(self.queue.get(True))
        return items

import re
from scripts.read_hdf import read_hdf
from epgn_info.apps.calculate.algorithm.class_calculate_two import *
from multiprocessing import cpu_count, Pool, Manager
from epgn_info.apps.calculate.algorithm.calculate_name import CalculateNameDict


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
            channel_file_info, channel_data = read_hdf(filename)
            yield channel_file_info, channel_front_list, calculate_class_name, filename, channel_data

    def parse_file_info(self):
        pool = Pool(cpu_count())
        # queue = Manager().Queue()
        # 计算: 使用多进程完成CPU密集型
        for channel_file_list, channel_front_list, calculate_class_name, filename, channel_data in self.parse_json():

            for channel in channel_front_list:
                if channel['title'] in ["EngineRPM"]:
                    channel_front_list.remove(channel)

            for channel in channel_front_list:
                # TODO：尝试使用迭代器
                # time_key
                channel_time = list(channel_file_list.keys())[list(channel_file_list.values()).index("time")]
                channel_time_num = re.match(r'.*?(\d+)', channel_time).group(1)
                # data_key
                channel_data_key = list(channel_file_list.keys())[list(channel_file_list.values()).index(channel["title"])]
                channel_data_num = re.match(r'.*?(\d+)', channel_data_key).group(1)
                # rpm_key
                channel_rpm = list(channel_file_list.keys())[list(channel_file_list.values()).index("EngineRPM")]
                channel_rpm_num = re.match(r'.*?(\d+)', channel_rpm).group(1)

                """异步返回"""
                # 使用队列接受多进程中的数据返回值
                pool.apply_async(
                    self.calculate_process, args=(
                        self.queue,
                        calculate_class_name,
                        filename,
                        channel_data,
                        channel["title"],
                        int(channel_time_num) - 1,  # time
                        int(channel_data_num) - 1,  # data
                        int(channel_rpm_num) - 1,  # rpm
                    )
                )
        pool.close()
        pool.join()

    def calculate_process(self, queue, calculate_class_name, file_name, channel_data, channel_name, raw_time_num, raw_data_num, raw_rpm_num):
        """
        返回图片
        # img_path = eval(calculate_class_name)(file_name, channel_data, channel_name, raw_time_num, raw_data_num, raw_rpm_num).run()
        # img_path = re.match(r'.*?(/epgn_front_end/calculate_image/.*)', img_path).group(1)
        """
        # 返回item
        try:
            print(calculate_class_name, os.getpid())
            X, Y = eval(calculate_class_name)(file_name, channel_data, channel_name, raw_time_num, raw_data_num, raw_rpm_num).run()
            # 这里确定返回到前端的数据
            queue.put({"filename": file_name, "data": {"X": X, "Y": Y}})
        except:
            print("当前数据计算出错！")

    def run(self):
        # 使用进程间通信 返回多个数据的返回
        # 返回items里面是当前数据计算的结果，而不是当前数据计算结果的图片
        items = []
        self.parse_file_info()
        while True:
            if self.queue.empty():
                break
            items.append(self.queue.get())
        return items

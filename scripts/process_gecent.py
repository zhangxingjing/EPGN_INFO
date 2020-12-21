import re
from multiprocessing import cpu_count, Pool, Manager
from pprint import pprint
from apps.calculate.algorithm.calculate import *
from apps.calculate.algorithm.class_name import CalculateNameDict
from scripts.readHDF import read_hdf


class ParseTask(object):
    """
    Note：这部分有两个部分
        1. IO密集：读取文件信息（多线程），把所有的IO写在一个函数里
        2. CPU密集：算法计算（多进程）
    """

    def __init__(self, item, rpm_type, refer_channel):
        self.item = item
        self.rpm_type = rpm_type
        self.refer_channel = refer_channel
        self.queue = Manager().Queue()

    def parse_json(self):
        # 使用yield完成多协程的IO操作
        calculate_name = self.item["calculate"]  # 算法名称
        channel_info_list = self.item["file_info"]["children"]  # 前端发送的文件列表数据（一级列表）
        calculate_class_name = calculate_name  # 将算法名称传递到工厂模式中 ==> 拿到当前算法中的类名
        # calculate_class_name = CalculateNameDict[calculate_name]

        for info_dict in channel_info_list:
            filename = info_dict["title"]
            channel_front_list = info_dict["children"]  # 二级列表
            # 读文件的时候就要切换线程 ==> 就在当前进程中切换 ==> 协程
            channel_file_info, channel_data = read_hdf(filename)
            yield channel_file_info, channel_front_list, calculate_class_name, filename, channel_data

    def parse_file_info(self):
        pool = Pool(cpu_count())
        # 计算: 使用多进程完成CPU密集型
        for channel_file_list, channel_front_list, calculate_class_name, filename, channel_data in self.parse_json():
            for channel in channel_front_list:
                if channel['title'] in ["EngineRPM"]:
                    channel_front_list.remove(channel)
            for channel in channel_front_list:
                # time_key
                channel_time = list(channel_file_list.keys())[list(channel_file_list.values()).index("time")]
                channel_time_num = re.match(r'.*?(\d+)', channel_time).group(1)

                # data_key
                channel_data_key = list(channel_file_list.keys())[list(channel_file_list.values()).index(channel["title"])]
                channel_data_num = re.match(r'.*?(\d+)', channel_data_key).group(1)
                try:
                    # rpm_key
                    channel_rpm = list(channel_file_list.keys())[list(channel_file_list.values()).index("data_EngineRPM")]
                    channel_rpm_num = re.match(r'.*?(\d+)', channel_rpm).group(1)
                except:
                    channel_rpm_num = 2

                if channel_rpm_num != channel_data_num:
                    """异步返回 ==> 使用队列接受多进程中的数据返回值"""
                    pool.apply_async(
                        self.calculate_process, args=(
                            self.queue,
                            calculate_class_name,
                            filename,
                            channel_data,
                            self.rpm_type,
                            channel["title"],
                            int(channel_time_num) - 1,  # time
                            int(channel_data_num) - 1,  # data
                            int(channel_rpm_num) - 1,  # rpm
                        )
                    )
        pool.close()
        pool.join()

    def calculate_process(self, queue, calculate_class_name, file_name, channel_data, rpm_type, channel_name, raw_time_num, raw_data_num, raw_rpm_num):
        # 返回图片
        # img_path = eval(calculate_class_name)(file_name, channel_data, channel_name, raw_time_num, raw_data_num, raw_rpm_num).run()
        # img_path = re.match(r'.*?(/epgn_front_end/calculate_image/.*)', img_path).group(1)

        # 返回item
        try:
            X, Y = eval(calculate_class_name)(file_name, channel_data, rpm_type, channel_name, raw_time_num, raw_data_num, raw_rpm_num).run()
            queue.put({"filename": file_name, "data": {"X": X, "Y": Y}, "channel": channel_name})
        except:
            print("ParseTask >> calculate_process() 计算出错！")
            pass

    def run(self):
        # 使用进程间通信 返回多个数据的返回
        items = []
        self.parse_file_info()
        while True:
            if self.queue.empty():
                break
            items.append(self.queue.get())
        return items

    def user_run(self):
        """用户从前端页面选择数据信息、通道信息，同时制定使用的算法==>算法直接接受使用参数就可以"""
        items = []
        channel_front_list = []
        for channel_file_list, old_channel_front_list, calculate_class_name, filename, channel_data in self.parse_json():
            for channel in old_channel_front_list:
                if channel['title'] not in ["EngineRPM", "RPM"]:
                    channel_front_list.append(channel)

            for channel in channel_front_list:
                # time_key
                try:
                    channel_time = list(channel_file_list.keys())[list(channel_file_list.values()).index("time")]
                    channel_time_num = re.match(r'.*?(\d+)', channel_time).group(1)
                except:
                    return []

                # data_key
                # print(channel_file_list)
                channel_data_key = list(channel_file_list.keys())[list(channel_file_list.values()).index(channel["title"])]
                channel_data_num = re.match(r'.*?(\d+)', channel_data_key).group(1)

                # rpm_key
                # try:
                #     try:
                #         channel_rpm = list(channel_file_list.keys())[list(channel_file_list.values()).index("EngineRPM")]
                #         yieldchannel_rpm_num = re.match(r'.*?(\d+)', channel_rpm).group(1)
                #     except:
                #         try:
                #             channel_rpm = list(channel_file_list.keys())[list(channel_file_list.values()).index("data_EngineRPM")]
                #             channel_rpm_num = re.match(r'.*?(\d+)', channel_rpm).group(1)
                #         except:
                #             try:
                #                 channel_rpm = list(channel_file_list.keys())[list(channel_file_list.values()).index("RPM")]
                #                 channel_rpm_num = re.match(r'.*?(\d+)', channel_rpm).group(1)
                #             except:
                #                 channel_rpm = list(channel_file_list.keys())[list(channel_file_list.values()).index("data_RPM")]
                #                 channel_rpm_num = re.match(r'.*?(\d+)', channel_rpm).group(1)
                # except:
                #     # 没有RPM的情况
                #     channel_rpm_num = channel_data_num
                try:
                    # print(self.refer_channel[0], channel_file_list)
                    channel_rpm = list(channel_file_list.keys())[list(channel_file_list.values()).index("{}".format(self.refer_channel[0]))]
                    channel_rpm_num = re.match(r'.*?(\d+)', channel_rpm).group(1)
                except:
                    # return None
                    if calculate_class_name == "FftCalculate" or \
                            calculate_class_name == "LevelVsTime" or \
                            calculate_class_name == "StartStop":
                        channel_rpm_num = channel_data_num
                    else:
                        return None

                # print(calculate_class_name)
                # X, Y = eval(CalculateNameDict[calculate_class_name])(filename, channel_data, self.rpm_type, channel["title"], int(channel_time_num) - 1, int(channel_data_num) - 1, int(channel_rpm_num) - 1).run()
                X, Y = eval(calculate_class_name)(filename, channel_data, self.rpm_type, channel["title"], int(channel_time_num) - 1, int(channel_data_num) - 1, int(channel_rpm_num) - 1).run()
                items.append({"filename": filename, "data": {"X": X, "Y": Y}, "channel": channel["title"]})
        return items

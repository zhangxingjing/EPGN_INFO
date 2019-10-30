import re
import json
import numpy
import pymysql
from epgn_info.epgn_info.apps.calculate.algorithm.calculate_name import CalculateNameDict
from epgn_info.epgn_info.apps.calculate.algorithm.class_calculate import *


class FileArrayInfo():
    """
    业务逻辑
        1. 手动运行脚本，读取当前文件
        2. 将当前文件数据通过算法处理后返回
        2. 将文件数据信息，插入数据库
    数据调用
        1. 从前端获取当前查询的文件名
        2. 通过文件名，对比数据库中的`原始文件名`，获取当前文件的结果数据库路径
        3. 拿到结果数据的文件路径，读取当前文件中的结果数据
        4. 从前端获取当前使用的是什么算法，指定的是什么通道信息，获取正确的结果数据
    """

    def __init__(self):
        self.file_home = "/home/zheng/Documents/EPGN/"
        self.result_path = self.file_home + "/csv/"
        self.db = pymysql.connect(
            host="127.0.0.1",
            port=3306,
            user="root",
            password="root",
            db="demo",
            charset="utf8"
        )
        self.cursor = self.db.cursor()

    def read_file_header(self, file_path):
        """
        读取指定文件的通道信息
        :param file_path: 指定文件的绝对路径
        :return: 当前文件中的通道信息（dict）
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

    def get_file_list(self):
        # 获取当前所有文件绝对路径
        all_file_list = os.listdir(self.file_home)
        for file_name in all_file_list:
            path_info = os.path.join(self.file_home, file_name)  # 遍历拼接文件路径
            if os.path.isfile(path_info):
                yield path_info

    def write_result(self, result_dict, file_path):
        with open(file_path, 'a') as f:
            f.write(result_dict)
            f.write('\n')
            f.close()

    def save_to_sql(self, original_file_path, result_file_path):
        """
        获取当前执行的文件信息，写入数据库
        :param original_file_path: 原始文件名（绝对路径）
        :param result_file_path: 存有文件算法结果的文件名（绝对路径）
        :return: 提交数据存储结果
        """
        sql = "insert into result_info (original_file_name, result_file_path) values(\"%s\", \"%s\")" \
              % (original_file_path, result_file_path)
        try:  # 执行数据库回滚
            self.cursor.execute(sql)
            self.db.commit()
            print(original_file_path, "算法结果保存完成！")
        except:
            print("当前文件数据库写入错误，请检出文件信息！")

    def get_from_sql(self, channel_info, original_file_name):
        """
        获取数据库中索引，通过读取文件信息，返回当前文件指定通道的算法结果
        :param channel_info: 指定的通道信息
        :param original_file_name: 指定的文件名（绝对路径）
        :return: 当前数据的固定算法结果
        """
        print(channel_info, original_file_name)
        sql = "select * from result_info where original_file_name=\'%s\'" % original_file_name
        self.cursor.execute(sql)
        result_file_path = self.cursor.fetchall()[0][2]  # 获取当前文件名对应的json文件位置
        result = []
        with open(result_file_path, 'r') as f:
            for item in f.readlines():
                result.append(item.strip())
        result_dict = json.loads(result[0])
        # array_data = result_dict["LR_Oberende_X--LevelVsRpm"]  # 在这里获取到当前文件中指定的通道和算法结果
        array_data = result_dict[channel_info]
        item = numpy.array(array_data)  # 转换为数组
        # print(item)
        return item

    def run(self):
        """
        1. 获取文件存储位置的所有文件绝对路径
        2. 对于单个文件进行数据处理
            2.1 读取当前文件中的通道信息，使用不同算法计算其结果
            2.2 将算法计算结果保存到指定的文件（或数据库中）
        """
        # 1. 获取每个文件的通道信息
        for file_path in self.get_file_list():
            file_name = re.match('/home/zheng/Documents/EPGN/(.*).asc', file_path).group(1)
            dict_info = self.read_file_header(file_path)
            one_file_dict = {}
            if 'EngineRPM' in list(dict_info.values()):  # 处理没有RPM的情况
                for key, value in dict_info.items():
                    if value not in ["EngineRPM"]:
                        RPM_NUM = list(dict_info.values()).index('EngineRPM')
                        num = re.match(r'.*?(\d+)', key).group(1)
                        for calculate_class_name in CalculateNameDict.values():
                            # print(calculate_class_name, file_path, 0, num, RPM_NUM)
                            # a = eval(calculate_class_name)(file_path, 0, int(num), int(RPM_NUM)).run()  # 当前文件某一个通道下面的某一算法结果
                            a = [[1, 2], [2, 3], [3, 4]]
                            dict_key = value + "--" + calculate_class_name
                            one_file_dict[dict_key] = a
                save_json_path = self.result_path + file_name + '.txt'  # 结果文件存储路径
                self.write_result(json.dumps(one_file_dict), save_json_path)
                self.save_to_sql(file_path, save_json_path)
            else:
                print(file_name, "中没有指定RPM项！")


# file_info = FileArrayInfo()
# file_info.run()  # 获取文件信息写入数据库
# file_info.get_from_sql("LR_Oberende_X--LevelVsRpm", "/home/zheng/Documents/EPGN/700011 ( 0.00-30.00 s).asc")  # 读取数据库索引及文件信息

import os
import re
import h5py
import pymysql
# from epgn_info.epgn_info.settings.devp import FileSavePath    # Ngincx
from epgn_info.settings.devp import FileSavePath    # manage
# from epgn_info.epgn_info.apps.calculate.algorithm.acousvw_v03_1 import *  # Nginx
from epgn_info.apps.calculate.algorithm.acousvw_v03_1 import *  # manage

CalculateNameDict = {
    # the front end page： Corresponding class name
    "FFT": "FftCalculate",
    "FFT对时间": "FftVsTime",
    "FFT对转速": "FftVsRpm",
    "倍频程": "OctaveFft",
    "二阶对转速": "OrderVsVfft",
    "LEVEL对时间": "LevelVsTime",
    "LEVEL对转速": "LevelVsRpm",
}

CalculateNameList = ['write_result', 'fft_average', 'octave_fft', ]

class FileArrayInfo():
    """
    Business logic
        1. Run the script manually to read the current file ==> what file format reads faster
        2. Return the current file data through the algorithm and return
        2. Insert file data information into the database
    Data call
        1. Get the file name of the current query from the front end
        2. Get the result databases path of the current file by comparing the "origin file name" in the database with the file name
        3. Get the file path of the result data, read the result data in the current file
        4. Get the algorithm currently used form the front end, specify what channel information, and get the correct result data
    Work next week
        1. And Luo exchange matrix results transfer
    """

    def __init__(self):
        self.file_home = "/home/zheng/Documents/EPGN/"
        self.result_path = self.file_home + "/hdf/"
        self.db = pymysql.connect(
            host="127.0.0.1",
            port=3306,
            user="root",
            password="root",
            db="demo",
            charset="utf8"
        )
        self.cursor = self.db.cursor()

    def read_file_header(self, file_name):
        """
        Read channel information of the specified file
        :param file_path: Specify the absolute path of the file
        :return: Channel information in the current file（dict）
        """
        head_content = ""
        file_path = FileSavePath + file_name + '.asc'
        file = open(file_path, "r", encoding="gbk", errors="ignore")
        while True:
            file_content = file.readline()
            if not file_content:
                break
            if not file_content[0].isdigit():  # if the current line is the beginning of a letter, save it with data
                head_content += file_content
            elif file_content[0].isdigit():
                break

        # handing the channel dictionary in the header file
        try:
            header_info = re.match(r"(.*?)\[CodedChannel0](.*?)\[Channel\d](.*)", head_content, re.S).group(1)
        except AttributeError:
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

    def read_file_num(self, file_name):
        """
        read file array data
        :param file_name:the current file
        :return:the data from the current file
        """
        items = []
        data_content = ""
        split_tag = ' '  # 编码不同的时候，使用不同的读取方式
        file_path = FileSavePath + file_name + '.asc'
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
        if len(content_line_list[0].split(
                split_tag)) == 0:  # if the list obtained by thr first row value is incorrect, change the separator  ==> 9
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

    def get_file_list(self):
        # get the absolute  path of all current files
        all_file_list = os.listdir(self.file_home)
        for file_name in all_file_list:
            path_info = os.path.join(self.file_home, file_name)  # Traversing the splicing file path
            if os.path.isfile(path_info):
                yield path_info

    def write_result(self, array_key, array_value, file_path):
        # operate HDF5
        with h5py.File(file_path, 'a') as f:
            f.create_dataset(array_key, data=array_value)

    def save_to_sql(self, original_file_path, result_file_path):
        """
        Get the currently specified file information, write to the database
        :param original_file_path: original file name(absolute path)
        :param result_file_path: file name where the result of the file algorithm is stored(absolute path)
        :return: submit data storage results
        """
        sql = "insert into result_info (original_file_name, result_file_path) values(\"%s\", \"%s\")" % (original_file_path, result_file_path)
        try:  # perform database rollback
            self.cursor.execute(sql)
            self.db.commit()
            print(original_file_path, "Algorithm result saved!")
        except:
            print("The current file database is written incorrectly, please check out the file information!")

    def get_from_sql(self, channel_info, original_file_name):
        """
        Get the index in the database, and return the algorithm result of the specified channel of the current file by reading the file information
        :param channel_info: specified channel information
        :param original_file_name: specified file name(absolute path)
        :return: fixed algorithm result of current data
        """
        sql = "select * from result_info where original_file_name=\'%s\'" % original_file_name
        self.cursor.execute(sql)
        result_file_path = self.cursor.fetchall()[0][2]  # get the location of the json file corresponding to the current file name
        with h5py.File(result_file_path, 'r') as f:
            array_data = f[channel_info][:]
        return array_data

    def get_limit_line(self, channel_info, original_file_name):
        """
        get the limit line result of the current file
        :param item: the algorithm result from the current file and channel
        :return: the limit line result of the current file
        """
        item = self.get_from_sql(channel_info, original_file_name)
        item_dict = {
            'demo': "测试文件产生结果..."
        }
        print(item)
        return item_dict

    def run(self):
        """
        Get the absolute path of all files in the file storage location
        Data processing for a single file
            1. Read the channel information in the current file and calculate the result using different algorithms
            2. Save the algorithm calculation result to the specified file (or database)
        """
        # 1. get channel information for each file
        for file_path in self.get_file_list():
            file_name = re.match('/home/zheng/Documents/EPGN/(.*).asc', file_path).group(1)
            dict_info = self.read_file_header(file_name)
            save_json_path = self.result_path + file_name + '.h5'  # result file storage path

            if 'EngineRPM' in list(dict_info.values()):  # handing no RPM
                for key, value in dict_info.items():
                    # if value =="EngineRPM":
                    RPM_NUM = re.search('\d+', [k for k, v in dict_info.items() if v == "EngineRPM"][0]).group()
                    if value not in ["EngineRPM", ]:
                        num = re.match(r'.*?(\d+)', key).group(1)
                        item = self.read_file_num(file_name)
                        raw_time = item[10000:-10000, 0]
                        raw_data = item[10000:-10000, int(num)]
                        raw_rpm = item[10000:-10000, int(RPM_NUM)]

                        l_v_t = level_time(raw_time, raw_data)
                        self.write_result(value+ '--' + "level_time", l_v_t, save_json_path)

                        # l_v_r = level_rpm(raw_time, raw_data, raw_rpm)
                        # self.write_result(value+ '--' + "level_rpm", l_v_r, save_json_path)
                        # o_v = order_vfft(raw_time, raw_data, raw_rpm)
                        # self.write_result(value+ '--' + "order_vfft", o_v, save_json_path)

                        f_f_t = fft_average(raw_time, raw_data)
                        self.write_result(value+ '--' + "fft_average", f_f_t, save_json_path)

                        o_f = octave_fft(raw_time, raw_data)
                        self.write_result(value+ '--' + "octave_fft", o_f, save_json_path)
                self.save_to_sql(file_path, save_json_path)
            else:
                print(file_name, "中没有指定RPM项！")
            break


# FileArrayInfo().run()
# FileArrayInfo().get_from_sql("LR_Oberende_Z--level_time", "/home/zheng/Documents/EPGN/700021 ( 0.00-30.00 s).asc")
# FileArrayInfo().get_from_sql("LR_Oberende_X--LevelVsRpm", "/home/zheng/Documents/EPGN/700011 ( 0.00-30.00 s).asc")

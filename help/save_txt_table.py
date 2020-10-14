# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : save_txt_x.py
# Datetime : 2020/10/12 下午3:24


import os
import xlrd
from settings.dev import BASE_DIR

home_path = "/home/zheng/Documents/WorkFile/TEST"  # XLS文件 所在的文件夹 绝对路径\
file_init = "RA 60kmph run01"  # 单个XLS文件名
hz = 300  # 获取到多少行的数据

file_path = home_path + "/"
file_name = file_init + ".xls"


class ReadXls(object):
    def __init__(self, file_name, hz):
        """
        已知从第二列开始
        """
        self.hz = hz
        self.file_name = file_name
        self.file = file_path + file_name
        self.sheet = xlrd.open_workbook(self.file).sheet_by_name('Sheet1')  # 标签名
        self.row_start = self.row_end = self.column_start = self.column_end = 1

    def get_location(self):
        """
        获取当前文件中数据的起始位置
        :return: 位置数据
        """
        # A1-B1  A3-B3
        for row in range(self.sheet.nrows):
            value = self.sheet.row_values(row)[0]
            if value == "":
                self.row_start = row
                self.row_end = self.row_start + self.hz + 1  # 索引特性

        column_list = []
        for column in range(1, self.sheet.ncols):
            value = self.sheet.col_values(column)[self.row_start]
            if value == "":
                column_list.append(column)
        self.column_end = column_list[0]

    def read_file(self):
        """
        从文件中数据的起始位置获取数据
        :param row_start: 开始行
        :param row_end: 结束行
        :param column_start: 开始列
        :param column_end: 结束列
        :return: 多个数据的列表
        """
        for column in range(self.column_start, self.column_end):
            dat = []
            for a in range(self.row_start, self.row_end):
                cells = self.sheet.row_values(a)
                data = str(cells[column])
                dat.append(data)
            yield dat

    def save_txt(self, item):
        """
        将当个数据写入txt文件
        :param item: 单个数据列表
        :return:
        """
        result_name = item[0].replace(" ", "") + ".ninc"
        result_path = file_path + self.file_name[:-4]
        if os.path.exists(result_path) is False:
            try:
                os.makedirs(result_path)
            except:
                print("文件夹创建失败，请检查文件夹权限！")
        try:
            with open(result_path + "/" + result_name, 'w') as f:

                # 从这里开始写入数据到txt文件中
                save_path = result_path + "/" + result_name
                return item[1:], save_path
                # for num in item[1:]:
                #     f.write(num)
                #     f.write("\r\n")
        except:
            print("数据写入失败，请确认文件存储路径！")

    def run(self):
        """
        执行函数
        :return: 程序执行结果
        """
        self.get_location()
        for item in self.read_file():
            yield self.save_txt(item)


class SaveTxtTable(object):
    def read_table(self):
        """读取txt_table中的信息"""
        model = ""
        model_file_path = '/home/zheng/Documents/WorkFile/EPGN_INFO/help/txt_table.txt'
        with open(model_file_path, 'r') as f:
            for content in f.readlines():
                if content != None:
                    # 从文件中读取行数据时，会带换行符，使用strip函数去掉 换行符后存入列表
                    model = content.strip("\n")
            f.close()
        return model

    def save_txt_table(self, file_name, table_name, model):
        """将txt中的信息 按照指定格式 写入到txt_table中"""
        return_table_num = lambda x: str(x).zfill(2)
        table_num = return_table_num(table_name)
        with open(file_name, 'w') as f:
            # table信息
            f.write(model + '\r\n')
            f.write("TABLED1       {}LINEAR  LINEAR                                          +0000001".format(table_num) + '\r\n')
            f.close()

    def read_txt(self):
        """
        读取txt中的信息
        :return: txt_table中需要的数据格式
        """
        txt_info = []
        with open("HL_R_XDIC24X014.txt", 'r') as f:
            for content in f.readlines():
                if content != None:
                    num = float(content.strip("\n"))
                    if num < 1:  # 当a < 1 , 小数点后取7位
                        item = "{:.7f}".format(num)
                        item = item[1:]
                    if num > 1:  # 当a > 1 , 小数点后取6位
                        item = "{:.6f}".format(num)
                    txt_info.append(item)
            f.close()

        # 将文件的数据四个四个分组
        # 匿名函数
        new_list = lambda list_: map(lambda b: list_[b:b + 4], range(0, len(list_), 4))
        # print(list(new_list(list_)))

        # 列表推导式
        # print([list_[i:i + 4] for i in range(0, len(list_), 4)])
        return list(new_list(txt_info))

    def write_num(self, file_name, table_name, num_list):
        """
        这里是我们从获取excel里面就保存txt_table
        还是从txt中转换
        :return:
        """

        # 返回每行的序号
        return_sort_index = lambda x: str(x).zfill(7)

        model = self.read_table()
        self.save_txt_table(file_name, table_name, model)
        # txt_list = self.read_txt()

        # 把列表四个四个分割
        num_list = num_list
        new_list = lambda list_: map(lambda b: list_[b:b + 4], range(0, len(list_), 4))
        num_list = list(new_list(num_list))

        with open(file_name, 'a+') as f:
            num_index = 1
            for line_value_list, sort_index in zip(num_list, range(2, len(num_list) + 2)):
                f.write("+{}".format(return_sort_index(sort_index - 1)))

                for content in line_value_list:

                    num = float(content.strip("\n"))
                    if num < 1:  # 当a < 1 , 小数点后取7位
                        item = "{:.7f}".format(num)
                        line_value = item[1:]
                    if num > 1:  # 当a > 1 , 小数点后取6位
                        line_value = "{:.6f}".format(num)

                    f.write('{:>7}.'.format(num_index) + line_value)
                    num_index += 1

                f.write("+{}".format(return_sort_index(sort_index)))
                f.write('\n')

            f.write("+{}".format(return_sort_index(sort_index)) + "ENDT" + "\n")
            f.write("$" * 80 + "\n")
            f.write("$" * 80 + "\n")
            f.close()

    def run(self, file_name, hz):
        table_name = 1
        for excel_num_list, save_path in ReadXls(file_name, hz).run():
            self.write_num(save_path, table_name, excel_num_list)
            table_name += 1

# SaveTxtTable().run(file_name, hz)

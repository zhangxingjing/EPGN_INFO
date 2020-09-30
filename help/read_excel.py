# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : read_excel.py
# Datetime : 2020/9/18 下午2:48


import os
import xlrd

home_path = "/home/zheng/Documents/WorkFile/TEST"  # XLS文件 所在的文件夹 绝对路径
file_init = "asphaltConstant60km8192"  # 单个XLS文件名
hz = 300  # 获取到多少行的数据

file_path = home_path + "/"
file_name = file_init + ".xls"


class ReadXls(object):
    def __init__(self):
        """
        已知从第二列开始
        """
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
                self.row_end = self.row_start + hz + 1  # 索引特性

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
        result_name = item[0].replace(" ", "") + ".txt"
        result_path = file_path + file_name[:-4]
        if os.path.exists(result_path) is False:
            try:
                os.makedirs(result_path)
            except:
                print("文件夹创建失败，请检查文件夹权限！")
        try:
            with open(result_path + "/" + result_name, 'w') as f:
                for num in item[1:]:
                    f.write(num)
                    f.write("\r\n")
        except:
            print("数据写入失败，请确认文件存储路径！")

    def run(self):
        """
        执行函数
        :return: 程序执行结果
        """
        self.get_location()
        for item in self.read_file():
            self.save_txt(item)


if __name__ == '__main__':
    """入口函数"""
    ReadXls().run()

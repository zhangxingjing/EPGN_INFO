# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author : Zheng Xingtao
# File : zipfile
# Datetime : 2020/8/14 上午9:52


import os
import re
import zipfile
import zipstream
from io import StringIO


class MemoryZipFile(object):
    def __init__(self):
        # 创建内存文件
        self._memory_zip = StringIO()

    def append_file(self, filename_in_zip, local_file_full_path):
        """
        description:写文件内容到zip
        注意这里的第二个参数是本地磁盘文件的全路径:
            windows: c:/demo/1.jpg
            linux: /usr/local/test/1.jpg
        """
        zf = zipfile.ZipFile(self._memory_zip, "a", zipfile.ZIP_DEFLATED, False)
        zf.write(local_file_full_path, filename_in_zip)
        for zfile in zf.filelist: zfile.create_system = 0
        return self

    def read(self):
        """
        description: 读取zip文件内容
        """
        self._memory_zip.seek(0)
        return self._memory_zip.read()


class ZipUtilities(object):
    """
    将文件或者文件夹打包成ZIP格式的文件，然后下载，在后台可以通过response完成下载
    """
    zip_file = None

    def __init__(self):
        self.zip_file = zipstream.ZipFile(mode='w', compression=zipstream.ZIP_DEFLATED)

    def to_zip(self, file, name):
        if os.path.isfile(file):
            self.zip_file.write(file, arcname=os.path.basename(file))
        else:
            self.add_folder_to_zip(file, name)

    def add_folder_to_zip(self, folder, name):
        for file in os.listdir(folder):
            full_path = os.path.join(folder, file)
            if os.path.isfile(full_path):
                try:
                    self.zip_file.write(
                        full_path,
                        arcname=os.path.join(name, os.path.basename(full_path))
                    )
                except:
                    self.zip_file.write(
                        full_path,
                        arcname=os.path.join(re.findall(r'(.*/(.*))', full_path)[0][1], os.path.basename(full_path))
                    )
            elif os.path.isdir(full_path):
                self.add_folder_to_zip(
                    full_path,
                    os.path.join(name, os.path.basename(full_path))
                )

    def close(self):
        if self.zip_file:
            self.zip_file.close()
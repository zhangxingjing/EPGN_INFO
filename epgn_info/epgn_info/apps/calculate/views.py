import json
from .algorithm.inner import inner
from django.shortcuts import render
from django.http import HttpResponse
from .algorithm.fft import return_data
from rest_framework.viewsets import ViewSet
from epgn_info.settings.dev_setting import BASE_DIR


# 接受前端参数, 获取要使用的算法名称, 后台使用不同的函数处理 ==> 后期使用类视图封装
def run_fft(self, request):
    """这里是傅里叶变换算法"""
    # file_name = 'F2 trotte run01 ( 0.00- 3.60 s).asc'
    file_info = request.body.decode()  # 获取前端传递的body内容(二进制编码)
    file_name_list = json.loads(file_info)["data"]  # 获取body中上传的文件名列表(json编码)
    for file_name in file_name_list:
        file_path, channel_dict, img_path = return_data(file_name)
        data = {
            "name": file_path,
            "channel_dict": channel_dict,
            "img": img_path
        }
    return render(request, '模板.html', data)


def run_inner(self, request):
    file_info = request.body.decode()  # 获取前端传递的body内容(二进制编码)
    file_name_list = json.loads(file_info)["data"]  # 获取body中上传的文件名列表(json编码)
    for file_name in file_name_list:
        filepath = "/home/spider/Music/" + file_name
        img_name = inner(filepath)
        print(file_name, img_name)
    return HttpResponse("OKOKOK")

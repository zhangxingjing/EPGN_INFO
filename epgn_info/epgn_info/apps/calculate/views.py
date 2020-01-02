import re
import json
import time

from django.shortcuts import render
from rest_framework.viewsets import ViewSet

from .algorithm.class_calcuate import *
from multiprocessing import cpu_count, Pool, Manager
from epgn_info.settings.devp import FileSavePath
from django.http import JsonResponse, HttpResponse
from .algorithm.calculate_name import CalculateNameDict
from .algorithm.read_file import read_file_header, read_file_num, read_file
from scripts.from_sql_data_h5 import FileArrayInfo, CalculateNameList
from .process_gecent import ParseTask


# 单文件通道： url(r'^channel/$', views.get_file_header)
def get_channel(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        channel_dict_list = []
        num_1 = 1
        for file in body_json["file_info"]:
            file_channel_info = {}
            file_name = file["file_name"]
            channel_list = read_file_header(file_name)
            channel_key_list = []

            for key, value in channel_list.items():
                channel_key_list.append({"title": value, "id": num_1})
                num_1 += 1

            file_channel_info["title"] = file_name
            file_channel_info["id"] = num_1
            file_channel_info["spread"] = True
            file_channel_info["children"] = channel_key_list
            channel_dict_list.append(file_channel_info)
            num_1 += 1
        main_info = [{
            "title": "文件夹名",
            "id": 1,
            "field": 'name1',
            "checked": False,
            "spread": True,
            "children": channel_dict_list
        }]
        return JsonResponse({"file_info": main_info})
    return HttpResponse("POST请求页面，请检查请求方式！")


# 多文件通道去重: url(r'^channel_list/$', views.get_channel_list),
def get_channel_list(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        data_list = body_json["file_info"]

        file_list = []
        set_channel_list = []
        for data in data_list:
            file_name = data["file_name"]
            file_list.append(file_name)
            channel_list = read_file_header(file_name)
            for values in channel_list.values():
                if values not in set_channel_list:
                    set_channel_list.append(values)

        return JsonResponse({
            "channel_list": set_channel_list,
            "algorithm": CalculateNameList,
            "file_list": file_list
        })
    return HttpResponse("当前为POST请求，请检查请求方式！")


# 多任务处理当前数据计算： url(r'^calculate/$', views.calculate),
def calculate(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        items = ParseTask(body_json).run()
        return JsonResponse({"data": items})
    return render(request, 'calculate.html')


# call result：url(r'^get_file_result/$', views.get_file_result),
def get_file_result(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)

        calculate_name = body_json["calculate"]
        # calculate_class_name = CalculateNameDict[calculate_name]  # algorithm name
        for info_dict in body_json["file_info"]["children"]:
            filename = info_dict["title"]  # file name
            channel_name = info_dict["children"][0]["title"]  # channel name

            if channel_name not in ["EngineRPM"]:  # remove RPM
                dict_key = channel_name + "--" + calculate_name
                file_path = FileSavePath + filename
                result_item = FileArrayInfo().get_limit_line(dict_key, file_path)
        return HttpResponse("OK")


# return_file_list: url(r'file_list/', views.return_file_list),
def return_file_list(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        data_list = body_json["file_info"]

        # channel_list
        file_list = []
        for data in data_list:
            file_name = data["file_name"]
            file_list.append(file_name)
        return JsonResponse({"file_list": file_list})


# algorithm page：url(r'^calculate/$', views.calculate),
"""
def calculate(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        calculate_name = body_json["calculate"] # 算法名称
        calculate_class_name = CalculateNameDict[calculate_name]    # 将算法名称传递到工厂模式中 ==> 拿到当前算法中的类名
        front_info_list = body_json["file_info"]["children"]    # 前端发送的文件列表数据（一级列表）

        data = []
        for info_dict in front_info_list:
            filename = info_dict["title"]
            channel_front_list = info_dict["children"]  # 二级列表
            channel_file_list = read_file_header(filename)

            channel_location = {}
            for channel in channel_front_list:
                channel_key = list(channel_file_list.keys())[list(channel_file_list.values()).index(channel["title"])]
                channel_key_num = re.match(r'.*?(\d+)', channel_key).group(1)
                channel_location[channel["title"]] = int(channel_key_num)

            for channel in channel_front_list:
                if channel['title'] in ["EngineRPM"]:   # 这个列表存放的是固定参数，后期添加
                    channel_front_list.remove(channel)

            for channel_info in channel_front_list:
                # 算法需要的参数
                # print(filename)
                # print("raw_time_num", int(0))
                # print("raw_data_num", channel_info["title"], int(channel_location[channel_info["title"]]))
                # print("raw_rpm_num", int(channel_location["EngineRPM"]))

                # 在这里使用多任务处理数据
                # gevent_func(calculate_class_name, filename, channel_info, channel_location)

                img_path = eval(calculate_class_name)(
                    filename,
                    channel_info["title"],
                    int(0),
                    int(channel_location[channel_info["title"]]),
                    int(channel_location["EngineRPM"])
                ).run()
                img_path = re.match(r'.*?(/epgn_front_end/calculate_image/.*)', img_path).group(1)
                data.append({"filename": filename, "img_path": img_path})
        return JsonResponse({"data": data})
    return render(request, 'calculate.html')
"""


# get algorithm results: url(r'^algorithm_results/$', views.get_algorithm_results)
def get_algorithm_results(request):
    # get parameters from front end
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        # print(body_json)
        channel = body_json["channel"]
        algorithm_name = body_json["algorithm_name"]
        filename = body_json["filename"]

        # pass data into the algorithm to draw & return data
        item = FileArrayInfo().get_from_sql(channel + '--' + algorithm_name, filename)
        image_path = item
        data = {
            "channel": channel,
            "algorithm_name": algorithm_name,
            "filename": filename,
            "img": image_path
        }  # 你想去我们可以找时间过去
        return JsonResponse(data=data)
    return HttpResponse("当前为POST请求，请检查请求方式")


# judge file channel: url(r'judge_file_channel/', views.judge_file_channel)
def judge_file_channel(request):
    # get parameters from frond end
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        # print(body_json)
        return JsonResponse({
            "item": [
                {
                    "filename": "这里传递当前文件的文件名",
                    "check": "True"
                },
                {
                    "filename": "把列表嵌套在JsonResponse里",
                    "check": "False"
                }
            ],
            "channel_list": [
                "channel_1",
                "channel_2"
            ]
        })


# 数据挖掘页面
def autocalculate(request):
    if request.method == "POST":
        return JsonResponse({"data": "data"})
    return render(request, 'autocalculate.html')

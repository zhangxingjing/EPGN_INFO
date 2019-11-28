import re
import json
from pprint import pprint
from django.shortcuts import render
# from .algorithm.class_calculate import *
from django.http import JsonResponse, HttpResponse
from .algorithm.calculate_name import CalculateNameDict
from .algorithm.read_file import read_file_header, read_file_num
from scripts.from_sql_data_h5 import FileArrayInfo, CalculateNameList
# from epgn_info.epgn_info.settings.devp import FileSavePath
from epgn_info.settings.devp import FileSavePath


# channel：url(r'^channel/$', views.get_file_header)
def get_file_header(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        channel_dict_list = []
        num_1 = 1
        for file in body_json["file_info"]:
            file_channel_info = {}
            # file_name = re.search(r'.*?_(.*).asc', file["file_name"]).group(1)
            file_name = file["file_name"]
            channel_list = read_file_header(file_name)
            channel_key_list = []

            for key, value in channel_list.items():  # take out all the values in the dictionary
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


# algorithm page：url(r'^calculate/$', views.calculate),
def calculate(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        pprint(body_json)
        calculate_name = body_json["calculate"]
        data = []
        # select by the top of the page channel_list ==> dictionary information in the file
        for info_dict in body_json["file_info"]["children"]:
            filename = info_dict["title"]
            calculate_class_name = CalculateNameDict[calculate_name]
            channel_front_list = info_dict["children"]
            channel_file_list = read_file_header(filename)

            # remove the channel location(index) obitained from the front
            channel_location = {}
            for channel in channel_front_list:
                channel_key = list(channel_file_list.keys())[list(channel_file_list.values()).index(channel["title"])]
                channel_key_num = re.match(r'.*?(\d+)', channel_key).group(1)
                channel_location[channel["title"]] = int(channel_key_num)

            # if you delete the RPM directly in the previous loop, there is no such key-value pair in the dictionary
            for channel in channel_front_list:
                # Replace different channel names and names with the same
                # ==> You can modify the file name on it. if you change the name directly in this list.
                if channel['title'] in ["EngineRPM"]:
                    channel_front_list.remove(channel)
            for channel_info in channel_front_list:
                img_path = eval(calculate_class_name)(filename,
                                                      0,
                                                      channel_location[channel_info["title"]],
                                                      channel_location["EngineRPM"]).run()  # Factory mode
                # The img_path returned at this time is the absolute path of the image ==> deal with
                img_path = re.match(r'.*?(/epgn_front_end/calculate_image/.*)', img_path).group(1)
                data.append({"filename": filename, "img_path": img_path})
        return JsonResponse({"data": data})
    return render(request, 'calculate.html')


# call result：url(r'^get_file_result/$', views.get_file_result),
def get_file_result(request):
    """
    1. get the current selected file from the front end, and the channel information selected by the user
    2. get the result data of the current file by the channel information-file name
    3. pass the result data to the function of the drawing, return the result
    """
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
                result_item = FileArrayInfo().get_limit_line(dict_key, file_path)  # object-oriented，result_item is the result data
        return HttpResponse("OK")


# channel list:url(r'^channel_list/$', views.get_channel_list),
def get_channel_list(request):
    # from get_file_header get file_channel_dict
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        data_list = body_json["file_info"]

        # channel_list
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


# get algorithm results: url(r'^algorithm_results/$', views.get_algorithm_results)
def get_algorithm_results(request):
    # get parameters from front end
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        print(body_json)
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
        }# 你想去我们可以找时间过去
        return JsonResponse(data=data)
    return HttpResponse("当前为POST请求，请检查请求方式")


# judge file channel: url(r'judge_file_channel/', views.judge_file_channel)
def judge_file_channel(request):
    # get parameters from frond end
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        print(body_json)
        return JsonResponse({
            "item":[
                {
                    "filename": "这里传递当前文件的文件名",
                    "check": "True"
                },
                {
                    "filename": "把列表嵌套在JsonResponse里",
                    "check": "False"
                }
            ],
            "channel_list":[
                "channel_1",
                "channel_2"
            ]
        })

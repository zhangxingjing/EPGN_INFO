import json
import re
from pprint import pprint
from django.shortcuts import render
from .algorithm.class_calculate import *
from django.http import JsonResponse, HttpResponse
from .algorithm.calculate_name import CalculateNameDict
from .algorithm.read_file import read_file_header, read_file_num


# 通道：url(r'^channel/$', views.get_file_header)
def get_file_header(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        channel_dict_list = []
        num_1 = 1
        for file in body_json["file_info"]:
            file_channel_info = {}
            file_name = re.search(r'.*?_(.*).asc', file["file_name"]).group(1)
            channel_list = read_file_header(file_name)
            channel_key_list = []

            for key, value in channel_list.items():  # 取出字典中的所有值
                channel_key_list.append({"title": value, "id": num_1})
                num_1 += 1

            file_channel_info["title"] = file_name
            file_channel_info["id"] = num_1
            file_channel_info["children"] = channel_key_list
            channel_dict_list.append(file_channel_info)
            num_1 += 1
        main_info = [{
            "title": "文件夹名",
            "id": 1,
            "field": 'name1',
            "checked": True,
            "spread": True,
            "children": channel_dict_list
        }]
        return JsonResponse({"file_info": main_info})


# 算法页面：url(r'^calculate/$', views.calculate),
def calculate(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        pprint(body_json)
        calculate_name = body_json["calculate"]
        data = []
        # 通过页面上面选择的 channel_list ==> 文件中的字典信息
        for info_dict in body_json["file_info"]["children"]:
            filename = info_dict["title"]
            calculate_class_name = CalculateNameDict[calculate_name]
            channel_front_list = info_dict["children"]
            channel_file_list = read_file_header(filename)

            # 从文件中取出前端获取的channel位置(index)
            channel_location = {}
            for channel in channel_front_list:
                channel_key = list(channel_file_list.keys())[list(channel_file_list.values()).index(channel["title"])]
                channel_key_num = re.match(r'.*?(\d+)', channel_key).group(1)
                channel_location[channel["title"]] = int(channel_key_num)

            # 如果再上一个循环里面直接就删除了这个RPM，在字典里面就没有这个键值对了
            for channel in channel_front_list:
                if channel['title'] in ["EngineRPM"]:  # 把不同的通道名，名字换成一样的 ==> 在上面可以修改文件名如果在这个列表里面就直接修改名字
                    channel_front_list.remove(channel)
            for channel_info in channel_front_list:
                print(channel_info)
                img_path = eval(calculate_class_name)(filename, 0, channel_location[channel_info["title"]], channel_location["EngineRPM"]).run()  # 工厂模式

                # 这时候返回的img_path是图片绝对路径 ==> 处理
                img_path = re.match(r'.*?(/epgn_front_end/calculate_image/.*)', img_path).group(1)
                data.append({"filename": filename, "img_path": img_path})
        return JsonResponse({"data": data})
    return render(request, 'calculate.html')

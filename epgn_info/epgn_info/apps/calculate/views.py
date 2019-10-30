import re
import json
from pprint import pprint
from django.shortcuts import render
from .algorithm.class_calculate import *
from django.http import JsonResponse, HttpResponse
from .algorithm.calculate_name import CalculateNameDict
from .algorithm.read_file import read_file_header, read_file_num
from epgn_info.scripts.upload_read_file import FileArrayInfo
from epgn_info.epgn_info.settings.devp import FileSavePath


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
                img_path = eval(calculate_class_name)(filename, 0, channel_location[channel_info["title"]],
                                                      channel_location["EngineRPM"]).run()  # 工厂模式
                # 这时候返回的img_path是图片绝对路径 ==> 处理
                img_path = re.match(r'.*?(/epgn_front_end/calculate_image/.*)', img_path).group(1)
                data.append({"filename": filename, "img_path": img_path})
        return JsonResponse({"data": data})
    return render(request, 'calculate.html')


# 调用结果：url(r'^get_file_result/$', views.get_file_result),
def get_file_result(request):
    """
    1. 从前端获取当前选择的文件，以及用户选择的通道信息
    2. 通过通道信息-文件名，获取当前文件的结果数据
    3. 将结果数据传递到绘图的函数中，返回结果
    """
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)

        calculate_name = body_json["calculate"]
        calculate_class_name = CalculateNameDict[calculate_name]  # 算法名
        for info_dict in body_json["file_info"]["children"]:
            filename = info_dict["title"]  # 文件名
            channel_name = info_dict["children"][0]["title"]  # 通道名

            if channel_name not in ["EngineRPM"]:  # 提出RPM
                dict_key = channel_name + "--" + calculate_class_name
                file_path = FileSavePath + filename
                result_item = FileArrayInfo().get_from_sql(dict_key, file_path)  # 面向对象，result_item就是结果数据
                print(result_item)  # 在这里拿到结果数据之后，把数据传递到绘图的函数里面
        return HttpResponse("OK")

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
        for file in body_json["file_info"]:
            channel_list = read_file_header(file["filename"])
            pprint(channel_list)
            channel_key_list = []
            for key, value in channel_list.items():  # 取出字典中的所有值
                channel_key_list.append(value)
            file["channel_list"] = channel_key_list
        return JsonResponse(body_json)


# 算法页面：url(r'^calculate/$', views.calculate),
def calculate(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)

        calculate_name = body_json["calculate"]
        data = []
        # 通过页面上面选择的 channel_list ==> 文件中的字典信息
        for info_dict in body_json["info"]:
            filename = info_dict["filename"]
            calculate_class_name = CalculateNameDict[calculate_name]
            channel_front_list = info_dict["channel_list"]
            channel_file_list = read_file_header(filename)

            # 从文件中取出前端获取的channel位置(index)
            channel_location = {}
            for channel in channel_front_list:
                channel_key = list(channel_file_list.keys())[list(channel_file_list.values()).index(channel)]
                channel_key_num = re.match(r'.*?(\d+)', channel_key).group(1)
                channel_location[channel] = int(channel_key_num)

            # 如果再上一个循环里面直接就删除了这个RPM，在字典里面就没有这个键值对了
            for channel in channel_front_list:
                if channel in ["EngineRPM"]:  # 把不同的通道名，名字换成一样的 ==> 在上面可以修改文件名如果在这个列表里面就直接修改名字
                    channel_front_list.remove(channel)
            for channel_info in channel_front_list:
                img_path = eval(calculate_class_name)(filename, 0, channel_location[channel_info], channel_location["EngineRPM"]).run()  # 工厂模式
                data.append({"filename": filename, "img_path": img_path})
        return JsonResponse({"data": data})
    return render(request, 'calculate.html')


"""
接受前端参数，获取要使用的算法名称，后台交给不同的算法处理
data = {
    "calculate": fft,
    "info": [
        {
            "filename": filename,
            "channel_list": [“”"VL", "VR"]
        },
    ]
}

所有后台处理完数据，返回：
data = [
    {
        "filename":filename,
        "image":img_path
    },
]
"""

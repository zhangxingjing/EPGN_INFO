import json
from pprint import pprint
from django.shortcuts import render
from .algorithm.class_calculate import *
from django.http import JsonResponse, HttpResponse
from .algorithm.calculate_name import CalculateNameDict
from .algorithm.read_file import read_file_header, read_file_num


# 算法页面：url(r'^calculate/$', views.calculate),
def calculate(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)

        calculate_name = body_json["calculate"]
        data = []
        for info_dict in body_json["info"]:
            filename = info_dict["filename"]
            calculate_class_name = CalculateNameDict[calculate_name]
            # 通过页面上面选择的 channel_list ==> 文件中的字典信息
            channel_list = info_dict["channel_list"]

            img_path = eval(calculate_class_name)(filename, 0, 1, 8).run()  # 工厂模式
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

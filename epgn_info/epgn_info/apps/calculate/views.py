import re
import json
from django.views import View
from django.shortcuts import render
from django.http import HttpResponse
from .algorithm.fft import return_data
from rest_framework.viewsets import ViewSet


class FftAlgorithm(View):
    def post(self, value):
        # 如果前端使用POST方式传值, 就在这里进行计算

        data = json.dumps({"data": "This is FFT-POST"})

        return HttpResponse(data)


# 接受前端参数, 获取要使用的算法名称, 后台使用不同的函数处理
class CalculateItem(ViewSet):
    def fft_info(self, request):
        content = request.POST.get("filename")
        dir_path = "/media/pysuper/文件/大众/file/Practice_Data/"
        print(dir_path + content)
        file_path, channel_dict, img_path = return_data(dir_path, content)
        data = {
            "name": file_path,
            "channel_dict": channel_dict,
            "img": img_path
        }
        return render(request, 'calculate.html', data)

    def lvsItem(self, request):
        content = request.POST.get("filename")
        print(content)
        return HttpResponse("<h1>这是什么LVSTime</h1>")

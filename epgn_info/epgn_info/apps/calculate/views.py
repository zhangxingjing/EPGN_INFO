from django.shortcuts import render
from django.http import HttpResponse
from .algorithm.fft import return_data
from rest_framework.viewsets import ViewSet


# 先在上面定义好每个要使用的算法，封装好
# class FftAlgorithm(View):
#     def post(self, request):
#         # 如果前端使用POST方式传值, 就在这里进行计算
#         file_name = request.POST
#         file_path, channel_dict, img_path = return_data(file_name)
#         data = json.dumps({"data": "This is FFT-POST"})
#
#         return HttpResponse(data)


# 接受前端参数, 获取要使用的算法名称, 后台使用不同的函数处理
class CalculateItem(ViewSet):
    def fft_info(self, request):
        """这里是傅里叶变换算法"""
        content = request.POST.get("filename")
        dir_path = "/media/pysuper/文件/大众/file/Practice_Data/" + content
        file_path, channel_dict, img_path = return_data(dir_path)
        data = {
            "name": file_path,
            "channel_dict": channel_dict,
            "img": img_path
        }
        return render(request, 'calculate.html', data)

    def lvsItem(self, request):
        """这里是 XXX 算法"""
        content = request.POST.get("filename")
        print(content)
        return HttpResponse("<h1>这是什么LVSTime</h1>")

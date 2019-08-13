import json

from django.contrib.auth.decorators import login_required

from .algorithm.inner import inner
from django.http import JsonResponse
from .algorithm.fft import return_data

@login_required
def run_fft(request):
    """
    傅里叶变换算法
    :param request: 客户端发送的请求对象
    :return: 当前文件数据经过算法处理后返回的结果
    """
    file_info = request.body.decode()  # 获取前端传递的body内容(二进制编码)
    file_name_list = json.loads(file_info)["data"]  # 获取body中上传的文件名列表(json编码)
    for file_name in file_name_list:
        file_path, channel_dict, img_path = return_data(file_name)
        print(file_path, channel_dict, img_path)
    return JsonResponse({"ad":"ADC"})

@login_required
def run_inner(request):
    """
    内部噪声算法
    :param request: 客户端发送的请求对象
    :return: 当前文件数据经过算法处理后返回的结果
    """
    file_info = request.body.decode()
    file_name_list = json.loads(file_info)["data"]
    item = []
    for file_name in file_name_list:
        filepath = "/home/spider/Music/" + file_name
        image_path = inner(filepath)
        print({file_name:image_path})
        item.append({file_name:image_path})
    return JsonResponse({"items":item})


"""
接受前端参数，获取要使用的算法名称，后台交给不同的算法处理
所有后台处理完数据，返回：
data = {
    "filename":filename,
    "image":img_path
}
"""

import json
from pprint import pprint

from .algorithm.inner import inner
from django.shortcuts import render
from .algorithm.fft import return_data
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from .algorithm.read_file import read_file_header, read_file_num


# 如果不是GET请求，这里接受前端传递的参数，判断选择指定的算法，返回一样的结果

# 算法页面的首页
# @login_required
def calculate(request):
    if request.method == "POST":
        # 接受前端传递的参数--文件名列表
        # filename_list = request.POST.get("filename_list", [])
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)

        data = []
        for filename in body_json["filename_list"]:
            # 拼接每个文件名, 拼接文件的绝对路径 ==> 算法返回当前文件的通道信息
            file_path = "/home/spider/Music/大众/EPGN_INGO/" + filename
            channel_dict = read_file_header(file_path)

            data.append({
                "filename": filename,
                "children": json.dumps(channel_dict)
            })
        pprint(data)
        return JsonResponse({"data": data})

    string = "访问无效! 请联系超管"
    return HttpResponse({"string": string})


# 获取文件名，返回通道信息
# @login_required
def get_file_header(request):
    filename = request.POST.get("filename")
    save_path = "/home/spider/Music/asc/"  # work
    # 读取文件通道信息
    channel_dict = read_file_header(save_path + filename)
    print("ReadFile:", channel_dict)
    return HttpResponse(json.dumps(channel_dict))


# 处理FFT
# @login_required
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
    return JsonResponse({"ad": "ADC"})


# 处理内部噪声
# @login_required
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
        print({file_name: image_path})
        item.append({file_name: image_path})
    return JsonResponse({"items": item})


"""
接受前端参数，获取要使用的算法名称，后台交给不同的算法处理
所有后台处理完数据，返回：
data = {
    "filename":filename,
    "image":img_path
}
"""

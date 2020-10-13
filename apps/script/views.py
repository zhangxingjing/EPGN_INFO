import re

from django.http import StreamingHttpResponse, JsonResponse
from django.shortcuts import render

from help.save_txt_table import SaveTxtTable
from scripts import zip_file


# Create your views here.

def script_index(request):
    return render(request, "script/script.html")


def read_excel(request):
    """
    获取前端发送的路径信息，传递到ReadXls中，返回数据
    :return: 多个文件，并且直接下载
    """
    if request.method == "GET":
        return render(request, "script/excel.html")

    files = request.FILES.get("file")
    hz = int(request.POST.get("hz"))

    # 把文件上传到服务器
    home_path = "/home/zheng/Documents/WorkFile/TEST/"
    new_file = open(home_path + str(files), 'wb+')
    for chunk in files.chunks():
        new_file.write(chunk)

    # 解析文件
    SaveTxtTable().run(str(files), hz)
    return JsonResponse({"code": 0, "file": str(files), "msg": "文件已保存到 {}".format(home_path + str(files))})


def download(request):
    """
    将解析之后的文件下载到本地
    :param request:
    :return:
    """
    file_name = request.GET.get("file", None)[:-4]  # 这时候从前端获取到的应该是一个文件夹的名称

    home_path = "/home/zheng/Documents/WorkFile/TEST/"
    file_path = home_path + file_name

    # 从服务器获取所有文件打包成压缩文件，发送到客户端
    utilities = zip_file.ZipUtilities()
    utilities.add_folder_to_zip(file_path, file_name)

    # utilities.close() # TODO: 这里关闭内存的话，数据没法返回
    response = StreamingHttpResponse(utilities.zip_file, content_type='application/zip')
    response['Content-Disposition'] = 'attachment;filename="{0}.zip"'.format(file_name)
    return response

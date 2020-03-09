import json
import math
from pprint import pprint
from time import time

from django.views import View
from django.shortcuts import render
# from epgn_info.scripts.parse_ppt import *  # Nginx
# from epgn_info.scripts.read_hdf import read_hdf  # Nginx
# from epgn_info.scripts.process_gecent import ParseTask  # Nginx
# from epgn_info.scripts.from_sql_data_h5 import FileArrayInfo, CalculateNameList  # Nginx
from scripts.parse_ppt import *  # manage
from read_hdf import read_hdf  # manage
from scripts.process_gecent import ParseTask  # manage
from scripts.from_sql_data_h5 import FileArrayInfo, CalculateNameList  # Nginx
from django.http import JsonResponse, HttpResponse, StreamingHttpResponse


# from scripts.from_sql_data_h5 import FileArrayInfo, CalculateNameList # manage


# 单文件通道： url(r'^channel/$', views.get_file_header)
def get_channel(request):
    """
    ASC文件格式
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        channel_dict_list = []
        num_1 = 1
        for file in body_json["file_info"]:
            file_channel_info = {}
            file_name = file["file_name"]
            channel_list = read_file_header(file_name)
            channel_key_list = []

            for key, value in channel_list.items():
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
    """
    """可读HDF"""
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)

        channel_dict_list = []
        num_1 = 1
        for file in body_json["file_info"]:
            file_channel_info = {}
            file_name = file["file_name"]
            channel_dict, items = read_hdf(file_name)
            channel_key_list = []

            for key, value in channel_dict.items():
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


# 多文件通道去重: url(r'^channel_list/$', views.get_channel_list),
def get_channel_list(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        data_list = body_json["file_info"]

        file_list = []
        set_channel_list = []
        for data in data_list:
            file_name = data["file_name"]
            file_list.append(file_name)
            # channel_list = read_file_header(file_name)    修改为使用可读HDF
            channel_list, items = read_hdf(file_name)
            for values in channel_list.values():
                if values not in set_channel_list:
                    set_channel_list.append(values)

        return JsonResponse({
            "channel_list": set_channel_list,
            "algorithm": CalculateNameList,
            "file_list": file_list
        })
    return HttpResponse("当前为POST请求，请检查请求方式！")


# 多任务处理当前数据计算： url(r'^calculate/$', views.calculate),
def calculate(request):
    if request.method == "POST":
        ST = time()
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)

        items = ParseTask(body_json).run()
        if len(items) == 0:
            return JsonResponse({"status": 403, "msg": "当前文件出现的通道信息未登记，请联系管理员"})
        for item in items:
            x_list = list(item["data"]["X"])
            y_list = list(item["data"]["Y"])
            line_loc = []
            for x, y in zip(x_list, y_list):
                point_loc = []
                try:
                    point_loc.append(math.log(abs(x), 10))  # abs-取绝对值， log-取对数
                except:
                    continue
                point_loc.append(y)
                line_loc.append(point_loc)
            item["data"] = line_loc
        # data = json.dumps(items, cls=NumpyEncoder)  # TODO: 将Array放入字典
        # return HttpResponse(data)
        print("当前后台处理时间：", time() - ST)  # 从收到数据到返回数据时间
        return JsonResponse({"data_info": items})
    return render(request, 'calculate.html')


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


# 校验通道: url(r'judge_file_channel/', views.judge_file_channel)
def judge_file_channel(request):
    # get parameters from frond end
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        return JsonResponse({
            "item": [
                {
                    "filename": "这里传递当前文件的文件名",
                    "check": "True"
                },
                {
                    "filename": "把列表嵌套在JsonResponse里",
                    "check": "False"
                }
            ],
            "channel_list": [
                "channel_1",
                "channel_2"
            ]
        })
    return JsonResponse({"INFO": "当前页面请求出错啦"})


"""
# algorithm page：url(r'^calculate/$', views.calculate),
def calculate(request):
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        calculate_name = body_json["calculate"] # 算法名称
        calculate_class_name = CalculateNameDict[calculate_name]    # 将算法名称传递到工厂模式中 ==> 拿到当前算法中的类名
        front_info_list = body_json["file_info"]["children"]    # 前端发送的文件列表数据（一级列表）

        data = []
        for info_dict in front_info_list:
            filename = info_dict["title"]
            channel_front_list = info_dict["children"]  # 二级列表
            channel_file_list = read_file_header(filename)

            channel_location = {}
            for channel in channel_front_list:
                channel_key = list(channel_file_list.keys())[list(channel_file_list.values()).index(channel["title"])]
                channel_key_num = re.match(r'.*?(\d+)', channel_key).group(1)
                channel_location[channel["title"]] = int(channel_key_num)

            for channel in channel_front_list:
                if channel['title'] in ["EngineRPM"]:   # 这个列表存放的是固定参数，后期添加
                    channel_front_list.remove(channel)

            for channel_info in channel_front_list:
                # 算法需要的参数
                # print(filename)
                # print("raw_time_num", int(0))
                # print("raw_data_num", channel_info["title"], int(channel_location[channel_info["title"]]))
                # print("raw_rpm_num", int(channel_location["EngineRPM"]))

                # 在这里使用多任务处理数据
                # gevent_func(calculate_class_name, filename, channel_info, channel_location)

                img_path = eval(calculate_class_name)(
                    filename,
                    channel_info["title"],
                    int(0),
                    int(channel_location[channel_info["title"]]),
                    int(channel_location["EngineRPM"])
                ).run()
                img_path = re.match(r'.*?(/epgn_front_end/calculate_image/.*)', img_path).group(1)
                data.append({"filename": filename, "img_path": img_path})
        return JsonResponse({"data": data})
    return render(request, 'calculate.html')
"""

"""
# call result：url(r'^get_file_result/$', views.get_file_result),
def get_file_result(request):
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
                result_item = FileArrayInfo().get_limit_line(dict_key, file_path)
        return HttpResponse("OK")
"""


# get algorithm results: url(r'^algorithm_results/$', views.get_algorithm_results)
def get_algorithm_results(request):
    # get parameters from front end
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        # print(body_json)
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
        }
        return JsonResponse(data=data)
    return HttpResponse("当前为POST请求，请检查请求方式")


# 数据挖掘页面
def auto_calculate(request):
    if request.method == "POST":
        return JsonResponse({"data": "data"})
    return render(request, 'autocalculate.html')


# 处理PPT数据：
def parse_ppt(request):
    save_path = 'PPTModel/'
    body = request.body
    body_str = body.decode()
    body_json = json.loads(body_str)

    # 首先根据前端数据生成PPT，拿到扉页文件的绝对路径
    ppt_path = ParsePPT(body_json, save_path).run()  # 在本地生成一份指定的PPT
    file_name = re.search(r'(.*)/(.*\.pptx)', ppt_path).group(2)
    print(ppt_path, file_name)
    return JsonResponse({"path": ppt_path, "file_name": file_name})


# 下载PPT：
def download_ppt(request):
    body = request.body
    body_str = body.decode()
    body_json = json.loads(body_str)
    ppt_path = body_json["path"]
    file_name = body_json["file_name"]

    print(ppt_path, file_name)

    def file_iterator(file_path, chunk_size=512):
        """
        文件生成器,防止文件过大，导致内存溢出
        :param file_path: 文件绝对路径
        :param chunk_size: 块大小
        :return: 生成器
        """
        with open(file_path, mode='rb') as f:
            while True:
                count = f.read(chunk_size)
                if count:
                    yield count
                else:
                    break

    try:
        response = StreamingHttpResponse(file_iterator(ppt_path))
        # 以流的形式下载文件,这样可以实现任意格式的文件下载
        response['Content-Type'] = 'application/octet-stream'
        # Content-Disposition就是当用户想把请求所得的内容存为一个文件的时候提供一个默认的文件名
        # response['Content-Disposition'] = 'attachment;filename="{}"'.format(file_name)
        from django.utils.http import urlquote
        response['Content-Disposition'] = 'attachment;filename="%s"' % (urlquote(file_name))
    except:
        return HttpResponse("Sorry but Not Found the File")
    return response


# 测试当前下载链接
def test_request(request):
    return render(request, 'uploadppt.html')

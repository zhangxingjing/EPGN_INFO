import json
import math
import numpy as np
import pandas as pd
from time import time
from django.views import View
from scripts.parse_ppt import *
from django.shortcuts import render
from scripts.readHDF import read_hdf
from fileinfo.models import Fileinfo
from scripts.process_gecent import ParseTask
from settings.dev import REFERENCE_CHANNEL, FALLING_LIST
from calculate.algorithm.class_name import CalculateNameList
from apps.calculate.algorithm.class_name import CalculateNameDict
from django.http import JsonResponse, HttpResponse, StreamingHttpResponse


# 处理通道信息： url(r'^channelList/$', ChannelList.as_view()),
class ChannelList(View):

    # 文件通道信息
    def put(self, request):
        body = request.body
        body_str = body.decode()
        data_list = json.loads(body_str)["file_info"]

        set_channel_list = []
        channel_dict_list = []
        num_1 = 1
        for file in data_list:
            file_channel_info = {}
            file_name = file["file_name"]
            channel_dict, items = read_hdf(file_name)
            channel_key_list = []

            for key, value in channel_dict.items():
                set_channel_list.append(value.replace(' ', ''))
                channel_key_list.append({"title": value.replace(' ', ''), "id": 1000 + num_1})
                num_1 += 1

            file_channel_info["title"] = file_name
            file_channel_info["id"] = 10000 + num_1
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
        return JsonResponse({"file_info": main_info, "channel_list": list(set(set_channel_list))})

    # 通道去重
    def post(self, request):
        if request.method == "POST":
            body = request.body
            body_str = body.decode()
            data_list = json.loads(body_str)["file_info"]

            file_list = []
            set_channel_list = []
            for data in data_list:
                print(data)
                file_name = data["file_name"]
                file_list.append(file_name)
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


# 算法结果： url(r'^calculate/$', CalculateParse.as_view()),
class CalculateParse(View):

    def get(self, request):
        return render(request, 'calculate.html')

    # 通过算法返回数组数据
    def post(self, request):
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
        result_data = []

        # params-->filename-->status-->rpm_type
        for file in body_json["file_info"]["children"]:
            rpm_type = 'rising'  # 先设置一个默认值
            filename = file["title"]
            status = Fileinfo.objects.filter(file_name=filename)
            if len(status) > 0:
                status = status[0].status
                if status in FALLING_LIST:
                    rpm_type = 'falling'
            else:
                print("PPTParse >> parse_calculate() 出错！")
                return JsonResponse({"code": 500, "msg": "获取工况出错！"})

            # 重构传入算法的通道信息
            channel_info_list = []
            for channel_info in body_json["file_info"]["children"][0]["children"]:
                if channel_info["title"] not in REFERENCE_CHANNEL:
                    channel_info_list.append(channel_info)
            body_json["file_info"]["children"][0]["children"] = channel_info_list

            items = ParseTask(body_json, rpm_type).user_run()
            for item in items:
                x_list = list(item["data"]["X"])
                y_list = list(item["data"]["Y"])
                line_loc = []
                for x, y in zip(x_list, y_list):
                    point_loc = []
                    try:
                        point_loc.append(math.log(abs(x), 10))
                    except:
                        continue
                    point_loc.append(y)
                    line_loc.append(point_loc)
                item["data"] = line_loc
                result_data.append(item)
        return JsonResponse({"data_info": result_data})


# 处理PPT： url('^parse_ppt/$', PPTParse.as_view()),
class PPTParse(View):

    # 接收文件名，返回算法数据
    def put(self, request):
        return_items = self.parse_calculate(request)
        return JsonResponse({"status": 200, "msg": "OK！", "data": return_items})

    # 接受base64，返回PPT地址
    def post(self, request):
        body = request.body.decode()
        items = json.loads(body)
        try:
            ppt_path = ParsePPT(items).run()
            return JsonResponse({"status": 200, "path": ppt_path})
        except Exception as e:
            return JsonResponse({"status": 404, "msg": "当前访问出错，请联系超级管理员！"})

    # 接受需要下载的文件地址，返回文件信息
    def get(self, request):
        ppt_path = request.GET.get("path")
        file_name = re.search(r'.*/(.*\.pptx)', ppt_path).group(1)

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
            response['Content-Type'] = 'application/octet-stream'
            from django.utils.http import urlquote
            response['Content-Disposition'] = 'attachment;filename="%s"' % (urlquote(file_name))
        except:
            return HttpResponse("Sorry but Not Found the File")
        return response

    # 返回分段取峰值
    def patch(self, request):
        return_items = self.parse_calculate(request)

        for i in return_items:
            print(i["channel"])
        new_items = self.segment_for(list(return_items["data"]), 1000, [])
        return JsonResponse({"status": 200, "msg": "前端请求正常, 查看数据处理!"})

    # 算法处理 ==> 处理kp文件分段采集的数据量
    def parse_calculate(self, request):
        """
        从前端获取文件名，后台通过算法，返回当前文件列表中的所有文件的XY坐标信息
        :param request: Request请求对象
        :return: 前端数据列表产生的XY轴坐标信息
        """
        ave_items = []
        return_items = []
        body = request.body.decode()
        file_list = json.loads(body)["fileList"]

        for file in list(set(file_list)):
            status = Fileinfo.objects.filter(file_name=file)
            if len(status) > 0:
                status = status[0].status
            else:
                print("PPTParse >> parse_calculate() 出错！")

            # 判断加减速
            if status in FALLING_LIST:
                rpm_type = 'falling'
            else:
                rpm_type = 'rising'

            calculate_name = CalculateNameDict[status]
            channel_dict, items = read_hdf(file)
            channel_calculate_list = [i for i in channel_dict.values() if i not in REFERENCE_CHANNEL]  # 去除参考通道

            # 启停 ==> 只计算一个通道
            if status == "(Square&Lab)St-Sp":
                for ss_channel in channel_calculate_list:
                    if "X" in ss_channel:
                        channel_calculate_list = [ss_channel]

            # 构建children中的字典数据
            i = 1
            children_list = []
            for channel in channel_calculate_list:
                children_list.append({"id": i, "title": channel})
                i += 1

            # 构建传入算法的字典数据
            data = {
                "calculate": calculate_name,
                "file_info": {
                    "checked": "True",
                    "children": [
                        {
                            "children": children_list,
                            "id": 1,
                            "title": file
                        },
                    ],
                    "field": "name1",
                    "id": 1,
                    "spread": "True",
                    "title": "文件夹名"
                }
            }

            # 将data传入算法，进行计算，获取算法返回值
            items = ParseTask(data, rpm_type).run()

            # 返回的数据列表为空时，说明文件中的通道信息不在我们定义的channel_list中
            if len(items) == 0:
                return None

            # items里面存放的一个文件中所有通道的算法结果 ==> 添加 KP 80-20 的求均值
            for item in items:
                if status == "KP 80-20":
                    ave_items.append(item)
                else:
                    x_list = list(item["data"]["X"])
                    y_list = list(item["data"]["Y"])
                    line_loc = []
                    for x, y in zip(x_list, y_list):
                        point_loc = []
                        try:  # 当我们使用的算法是FFT的时候，需要对算法返回只进行log处理
                            if calculate_name == "FFT":
                                point_loc.append(math.log(abs(x), 10))  # abs-取绝对值， log-取对数
                            else:
                                point_loc.append(x)
                        except:
                            continue
                        point_loc.append(y)
                        line_loc.append(point_loc)
                    item["data"] = line_loc
                    item["status"] = status
                    return_items.append(item)

        # 对KP80-20工况下的数据进行求均值
        if len(ave_items) > 0:
            df = pd.DataFrame(ave_items)
            # 使用 pandas 对列表中的字典进行分类
            result = [{"filename": k, "info": g["data"].tolist()} for k, g in df.groupby("channel")]

            # 处理KP的分段采集数据 result-通道的字典
            for channels in result:
                list_y_sum = []
                for i in range(len(list(set(file_list)))):
                    a = channels["info"][i]["Y"]
                    list_y_sum.append(a)
                y_list = np.mean(list_y_sum, axis=0)  # 使用numpy求列表均值
                x_list = channels["info"][0]["X"]
                line_loc = []
                for x, y in zip(x_list, y_list):
                    point_loc = []
                    if x >= 1 and y > 0:
                        try:  # 当我们使用的算法是FFT的时候，需要对算法返回只进行log处理
                            point_loc.append(math.log(abs(x), 10))  # abs-取绝对值， log-取对数
                        except:
                            continue
                        point_loc.append(y)
                        line_loc.append(point_loc)

                return_items.append({
                    "status": "KP 80-20",
                    "filename": channels["filename"],
                    "data": line_loc
                })
        return return_items

    # 取峰值
    def segment_for(self, items, step, new_items):
        """
        分段取峰值(递归): 这里传进来的items, 包装了(x, y), 获取y值之后,取最大值, 再将这个点放进新的列表中
        :param items: 一个装有元组的列表
        :param step: 分段的步长
        :param new_items: 每一段的峰值列表
        :return: 分段取峰值之后的列表
        """
        if len(items) > step:
            new_items.append(max(items, key=lambda x: x[0]))  # 使用匿名函数, 获取比较y值之后的峰值
            self.segment_for(items[step:], step, new_items)
        else:
            new_items.append(max(items, key=lambda x: x[0]))
        return new_items


# 手动报告: url('^user_calculate/$', manual_report)
def manual_report(request):
    """
    从前端获取参数，生成手动报告
    :param request: 携带前端发送的参数信息
    :return: 当前文件、通道、算法的结果
    """
    return_items = []
    body = request.body
    body_str = body.decode()
    body_json = json.loads(body_str)
    for children_file in body_json["children"]:  # 前端发送的数据通道不止一条
        # 获取文件信息
        filename = children_file["title"]
        status = Fileinfo.objects.filter(file_name=filename)
        if len(status) > 0:
            status = status[0].status
        else:
            return JsonResponse({"code": 0, "msg": "PPTParse >> parse_calculate() 出错！"})
        # 判断加减速
        if status in FALLING_LIST:
            rpm_type = 'falling'
        else:
            rpm_type = 'rising'
        # 构建传入算法的字典数据
        i = 1
        children_list = []
        for channel in children_file["children"]:
            children_list.append({"id": i, "title": channel["title"]})
            i += 1
        data = {
            "calculate": body_json["calculate_name"],
            "file_info": {
                "checked": "True",
                "children": [
                    {
                        "children": children_list,
                        "id": 1,
                        "title": filename
                    },
                ],
                "field": "name1",
                "id": 1,
                "spread": "True",
                "title": "文件夹名"
            }
        }
        # 将data传入算法，进行计算，获取算法返回值
        items = ParseTask(data, rpm_type).run()
        # 返回的数据列表为空时，说明文件中的通道信息不在我们定义的channel_list中
        if len(items) == 0:
            return JsonResponse({"code": 0, "msg": "manual_report ==>  line 392 ==> len(items)=0"})

        for item in items:
            x_list = list(item["data"]["X"])
            y_list = list(item["data"]["Y"])
            line_loc = []
            for x, y in zip(x_list, y_list):
                point_loc = []
                try:  # 当我们使用的算法是FFT的时候，需要对算法返回只进行log处理
                    if body_json["calculate_name"] == "FFT":
                        point_loc.append(math.log(abs(x), 10))  # abs-取绝对值， log-取对数
                    else:
                        point_loc.append(x)
                except:
                    continue
                point_loc.append(y)
                line_loc.append(point_loc)
            item["data"] = line_loc
            item["status"] = status
            return_items.append(item)
    return JsonResponse({
        "code": 1,
        "data": return_items
    })


# 返回文件列表: url(r'file_list/', views.return_file_list),
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


# 数据挖掘页面：url(r'autocalculate/', auto_calculate),
def auto_calculate(request):
    if request.method == "POST":
        return JsonResponse({"data": "data"})
    return render(request, 'calculate.html')


# PDF：url('^test_page/$', test_page)
def test_page(request):
    return render(request, 'testpage.html')

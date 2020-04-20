import json
import math
from time import time
from pprint import pprint

import pandas as pd
from django.views import View
from django.shortcuts import render
from epgn_info.scripts.parse_ppt import *  # Nginx
from epgn_info.scripts.readHDF import read_hdf  # Nginx
from epgn_info.scripts.process_gecent import ParseTask  # Nginx
from epgn_info.scripts.from_sql_data_h5 import FileArrayInfo, CalculateNameList  # Nginx
# from epgn_info.scripts.from_sql_data_h5 import FileArrayInfo, CalculateNameList  # Nginx
from fileinfo.models import Fileinfo
from numpyencoder import NumpyEncoder

# from scripts.readHDF import read_hdf  # manage
# from scripts.parse_ppt import *  # manage
from epgn_info.epgn_info.settings.devp import CALCULATE_RULE, REFERENCE_CHANNEL, FALLING_LIST
# from scripts.process_gecent import ParseTask  # manage
from django.http import JsonResponse, HttpResponse, StreamingHttpResponse
# from scripts.from_sql_data_h5 import FileArrayInfo, CalculateNameList  # manage
from epgn_info.epgn_info.settings.devp import BASE_DIR    # Nginx
# from epgn_info.settings.devp import BASE_DIR  # manage


# 从文件中读取channel
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
                channel_key_list.append({"title": value.replace(' ', ''), "id": num_1})
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
        return JsonResponse({"file_info": main_info, "channel_list":list(set(set_channel_list))})

    # 通道去重
    def post(self, request):
        if request.method == "POST":
            body = request.body
            body_str = body.decode()
            data_list = json.loads(body_str)["file_info"]

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


# Calculate
class CalculateParse(View):

    def get(self, request):
        """
        1. 获取前端用户选择的文件名
        2. 通过算法，用通道匹配算法（图片位置）
        3. 将算法处理的结果数据返回到前端
        :param request: request请求对象
        :return: 当前calculate处理结果
        """
        return render(request, 'calculate.html')

    # 通过算法返回数组数据
    def post(self, request):
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


# PPT
class PPTParse(View):

    # 接收文件名，返回算法数据
    def put(self, request):
        return_items = self.parse_calculate(request)
        return JsonResponse({"status": 200, "msg": "OK！", "data": return_items})

    # 接受base64，返回PPT地址
    def post(self, request):
        # save_path = 'PPTModel/'
        # body = request.body
        # body_str = body.decode()
        # body_json = json.loads(body_str)
        #
        # # 首先根据前端数据生成PPT，拿到扉页文件的绝对路径
        # ppt_path = ParsePPT(body_json, save_path).run()  # 在本地生成一份指定的PPT
        # file_name = re.search(r'(.*)/(.*\.pptx)', ppt_path).group(2)
        # print(ppt_path, file_name)
        # return JsonResponse({"path": ppt_path, "file_name": file_name})
        body = request.body.decode()
        items = json.loads(body)
        try:
            ppt_path = ParsePPT(items).run()
            # 这里return的url，是可以直接下载的！
            print("ppt_path:", ppt_path)
            return JsonResponse({"status": 200, "path": ppt_path})
        except Exception as e:
            return JsonResponse({"status": 404, "msg": "当前访问出错，请联系超级管理员！"})

    # 接受需要下载的文件地址，返回文件信息
    def get(self, request):
        ppt_path = request.GET.get("path")
        print("ppt_path:", ppt_path)
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
            # 以流的形式下载文件,这样可以实现任意格式的文件下载
            response['Content-Type'] = 'application/octet-stream'
            # Content-Disposition就是当用户想把请求所得的内容存为一个文件的时候提供一个默认的文件名
            # response['Content-Disposition'] = 'attachment;filename="{}"'.format(file_name)
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

        # # 向data里面添加数据的时候,先进行分段取峰值 ==> 调用segment_for()使用递归的方式对列表数据进行分段取值
        # # 列表里面装的是当前的点(x, y), 通过y来判断取点位置
        new_items = self.segment_for(list(return_items["data"]), 1000, [])
        print(new_items)

        return JsonResponse({"status": 200, "msg": "前端请求正常, 查看数据处理!"})

    # 算法处理
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
        for file in list(set(file_list)):  # 防止前端多传文件，对文件列表进行去重
            rpm_type = 'rising'
            print(file, type(file))
            status = Fileinfo.objects.get(file_name=file).status

            # 判断当前文件加减速：获取当前工况，通过迭代判断当前是加速还是减速
            if status in FALLING_LIST:
                rpm_type = 'falling'

            # 如果当前文件的工况信息存在，说明这个文件是正确的
            if status:
                calculate_name = CALCULATE_RULE[status]  # 当前文件应该使用的算法名称
                channel_dict, items = read_hdf(file)  # 获取当前文件的通道信息，每个通道都放到算法中进行计算

                # 文件中的哪些数据通道需要放到算法中进行计算
                # 将参考通道删除，然后遍历其他通道将数据传给算法  ==> 使用列表推倒式
                # channel_calculate_list = [channel_name for channel_name in channel_dict.values()]  # 当前文件中通道信息组成的列表
                channel_calculate_list = [i for i in channel_dict.values() if i not in REFERENCE_CHANNEL]

                # 计算启停算法的时候，只计算一个通道的数据
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
                items = ParseTask(data, rpm_type).run()  # TODO: 这里两次接收items

                # 返回的数据列表为空时，说明文件中的通道信息不在我们定义的channel_list中
                if len(items) == 0:
                    return None
                    # return JsonResponse({"status": 403, "msg": "当前文件出现的通道信息未登记，请联系管理员"})

                # items里面存放的一个文件中所有通道的算法结果
                # 我们需要将 所有文件 中的 所有数据 ，按照键值对的形式存放到一个列表中，返回
                # 为了前端页面的数据结果展示，我们需要将数据包装成[(x1,y1),(x2,y2)..]的形式，返回
                # TODO: 添加 KP 80-20 的求均值
                for item in items:
                    if status == "KP 80-20":
                        ave_items.append(item)
                    else:
                        x_list = list(item["data"]["X"])
                        y_list = list(item["data"]["Y"])
                        line_loc = []
                        for x, y in zip(x_list, y_list):
                            point_loc = []

                            # 当我们使用的算法是FFT的时候，需要对算法返回只进行log处理
                            try:
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
            else:
                return None
                # return JsonResponse({"status": 500, "msg": "当前数据工况错误，请重新选择数据！"})

        # 对KP80-20工况下的数据进行求均值
        if len(ave_items) > 0:
            df = pd.DataFrame(ave_items)
            # 使用 pandas 对列表中的字典进行分类
            result = [{"filename": k, "info": g["data"].tolist()} for k, g in df.groupby("channel")]

            for channels in result:
                # 我怎么知道这里是多少个，用公式==> y(len(channels)) = channels["info"][len(channels)-1]
                y1 = channels["info"][0]["Y"]
                y2 = channels["info"][1]["Y"]
                y3 = channels["info"][2]["Y"]

                y_list = []
                for i in range(len(y1)):
                    y = (y1[i] + y2[i] + y3[i]) / int(len(channels))
                    y_list.append(y)

                x_list = channels["info"][2]["X"]
                line_loc = []
                for x, y in zip(x_list, y_list):
                    point_loc = []
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
        # return JsonResponse({"status": 200, "msg": "OK！", "data": return_items})

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
            # new_items.append(max(items[:3]))
            new_items.append(max(items, key=lambda x: x[0]))  # 使用匿名函数, 获取比较y值之后的峰值
            self.segment_for(items[step:], step, new_items)
        else:
            # new_items.append(max(items))
            new_items.append(max(items, key=lambda x: x[0]))
        return new_items


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


# get algorithm results: url(r'^algorithm_results/$', views.get_algorithm_results)
def get_algorithm_results(request):
    # get parameters from front end
    if request.method == "POST":
        body = request.body
        body_str = body.decode()
        body_json = json.loads(body_str)
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
    return render(request, 'calculate.html')


def test_page(request):
    return render(request, 'testpage.html')

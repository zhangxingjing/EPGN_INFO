import os
import re
import json
import difflib
import shutil
from scripts import zip_file
from django.db.models import Q
from django.db import transaction
from django.shortcuts import render
from django.core import serializers
from rest_framework import viewsets
from django.utils.http import urlquote
from settings.dev import AUDIO_FILE_PATH
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from fileinfo.models import Platform, PropulsionPower, GearBox
from audio.models import Audio, Description, Status, Frequency
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse, StreamingHttpResponse, HttpResponse
from fileinfo.serializers import GearBoxSerializer, PropulsionSerializer, CarModelSerializer
from audio.serializers import AudioSerializer, DescriptionSerializer, FrequencySerializer, AudioStatusSerializer


# 音频文件
class AudioViewSet(viewsets.ModelViewSet):
    queryset = Audio.objects.all()
    serializer_class = AudioSerializer

    # 上传
    def create(self, request, *args, **kwargs):
        description_id = request.POST.get("brief_description", None)  # 简单描述
        details = request.POST.get("detailed_description", None)  # 抱怨详细描述
        detail_from = request.POST.get("source", None)  # 抱怨来源
        complaint_feature = request.POST.get("complain_features", None)  # 抱怨特征
        frequency = request.POST.get("frequency", None)  # 频率
        order = request.POST.get("order", None)  # 阶次
        reason = request.POST.get("key_parts", None)  # 关键零件或因素
        measures = request.POST.get("measure", None)  # 措施
        car_model_id = request.POST.get("car_modal", None)  # 车型
        propulsion_id = request.POST.get("car_engine", None)  # 发动机
        gearbox_id = request.POST.get("car_gearbox", None)  # 变速箱
        power_id = request.POST.get("power", None)  # 功率
        author = request.POST.get("user_name", None)  # 上传人
        tire = request.POST.get("tire", None)  # 轮胎供应商
        status = request.POST.get("condition", None)  # 工况
        complain_mp3 = request.FILES.get("conplain_file", None)  # 抱怨原始数据
        img = request.FILES.get("conplain_pic", None)  # 抱怨特征图
        raw_mp3 = request.FILES.get("conplain_audio", None)  # 抱怨音频
        ppt = request.FILES.get("conplain_report", None)  # 分析报告

        raw_mp3_name = str(raw_mp3)  # 文件名
        img_name = str(img)  # 文件名
        complain_mp3_name = str(complain_mp3)  # 文件名
        ppt_name = str(ppt)  # 文件名

        description = Description.objects.get(id=description_id)
        car_model = Platform.objects.get(id=car_model_id).name
        propulsion = PropulsionPower.objects.get(id=propulsion_id).num
        power = PropulsionPower.objects.get(id=power_id).num
        gearbox = GearBox.objects.get(id=gearbox_id).name

        directory_path = AUDIO_FILE_PATH + description.name + "_" + car_model + "/"
        file_num = difflib.get_close_matches(description.name + "_" + car_model, os.walk(AUDIO_FILE_PATH))
        if len(file_num) > 1:
            print(int(len(file_num) + 1))

        # print(description.name, car_model, propulsion, power, gearbox, status, directory_path, file_num)
        # 获取文件之后处理业务逻辑
        if description_id and car_model and propulsion and power and gearbox and complaint_feature and status and frequency and author and tire and measures and reason and details:  # 对于同一个文件的抱怨数据，先看有没有这个抱怨
            # 无--新建文件夹，添加文件
            if not os.path.exists(directory_path):
                os.mkdir(directory_path)
            # else:
            #     file_num = difflib.get_close_matches("Brummen_T-Cross", os.listdir(AUDIO_FILE_PATH), cutoff=0.94) # /0.94
            #     if len(file_num) > 0:
            #         print(len(file_num))
            #         os.mkdir(AUDIO_FILE_PATH + "Brummen_T-Cross" + "_" + str(len(file_num)))

            # 有 --添加到之前的文件夹中
            try:
                with transaction.atomic():  # 数据库回滚
                    try:
                        # audio_list = [raw_mp3_name, img_name, complain_mp3_name, ppt_name]
                        # audio_dict = {"raw_mp3_name":raw_mp3, "img_name":img, "complain_mp3_name":complain_mp3, "ppt_name": ppt}
                        # for i in audio_list:
                        #     if len(i) > 4:  # 存在文件名
                        #         print(directory_path + i)
                        #         i_file = open(directory_path + i, 'wb+')
                        #         for chunk in audio_dict[i].chunks():
                        #             i_file.write(chunk)
                        #         i_file.close()

                        try:
                            # raw_mp3
                            new_raw_mp3 = open(directory_path + raw_mp3_name, 'wb+')
                            for chunk in raw_mp3.chunks():
                                new_raw_mp3.write(chunk)
                            new_raw_mp3.close()
                            new_raw_mp3_info = directory_path + raw_mp3_name
                        except:
                            print("new_raw_mp3 is None")
                            new_raw_mp3_info = None

                        try:
                            # image
                            image = open(directory_path + img_name, 'wb+')
                            for chunk in img.chunks():
                                image.write(chunk)
                            image.close()
                            image_info = directory_path + img_name
                        except:
                            print("new_image is None")
                            image_info = None

                        try:
                            # complain_mp3_name
                            new_complain_mp3 = open(directory_path + complain_mp3_name, 'wb+')
                            for chunk in complain_mp3.chunks():
                                new_complain_mp3.write(chunk)
                            new_complain_mp3.close()
                            new_complain_mp3_info = directory_path + complain_mp3_name
                        except:
                            print("new_complain_mp3 is None")
                            new_complain_mp3_info = None

                        try:
                            # ppt
                            new_ppt = open(directory_path + ppt_name, 'wb+')
                            for chunk in ppt.chunks():
                                new_ppt.write(chunk)
                            new_ppt.close()
                            new_ppt_info = directory_path + ppt_name
                        except:
                            print("new_ppt is None")
                            new_ppt_info = None

                    except OSError:
                        return Response(data={"code": 0, "msg": "文件不存在！"})
                    # 写入数据库
                    Audio(description=description,
                          details=details,
                          detail_from=detail_from,
                          complaint_feature=complaint_feature,
                          frequency=frequency,
                          order=order,
                          status=status,
                          reason=reason,
                          measures=measures,
                          car_model=car_model,
                          propulsion=propulsion,
                          gearbox=gearbox,
                          power=power,
                          tire_model=tire,
                          author=author,
                          # 这里存放文件的时候，应该保存当前文件的绝对路径
                          raw_mp3=new_raw_mp3_info,
                          img=image_info,
                          complain_mp3=new_complain_mp3_info,
                          ppt=new_ppt_info
                          ).save()

                    # 上传成功返回当前上传状态
                    return Response(data={"code": 1, "msg": "文件上传成功！"})
            except FileExistsError as error:  # 文件操作失败是, 数据库回滚, 同时删除网盘中已上传的原始HDF文件
                os.remove(directory_path + raw_mp3_name)
                os.remove(directory_path + complain_mp3_name)
                os.remove(directory_path + img_name)
                os.remove(directory_path + ppt_name)
                return Response(data={"code": 0, "msg": error})
        return Response(data={"code": 0, "msg": "文件上传失败。"})

    # 检索
    def list(self, request, *args, **kwargs):
        key_word = request.GET.get("key_word", None)  # 搜索词
        description = request.GET.get("brief_description", None)  # 简单描述
        status = request.GET.get("condition", None)  # 工况
        car_model = request.GET.get("car_modal", None)  # 车型
        propulsion = request.GET.get("car_engine", None)  # 发动机
        gearbox = request.GET.get("car_gearbox", None)  # 变速箱
        power = request.GET.get("power", None)  # 功率
        frequency = request.GET.get("frequency_range", None)  # 频率范围    TODO: 这里需要添加对频率的判断
        tire = request.GET.get("tire", None)  # 轮胎
        # frequency_result = re.findall(r'(\d+).*?(\d+)', frequency)
        # frequency_0 = frequency_result[0][0]
        # frequency_1 = frequency_result[0][1]
        # if frequency in range(frequency_0, frequency_1):
        #     print(frequency, "这里是对频率范围进行判断取值！")

        # 这里是分页查询的page和limit
        page = request.GET.get('page', "1")
        limit = int(request.GET.get('limit', "20"))


        print("key_word::::::::",key_word)
        print("description::::::::",description)
        print("status::::::::",status)
        print("car_model::::::::",car_model)
        print("propulsion::::::::",propulsion)
        print("gearbox::::::::",gearbox)
        print("power::::::::",power)
        print("frequency::::::::",frequency)
        print("tire::::::::",tire)
        print("page::::::::",page)
        print("limit", limit)

        search_dict = {}
        if key_word == "":
            key_word = None
        if key_word is None and description is None and status is None and car_model is None and propulsion is None and gearbox is None and power is None and frequency is None and tire is None:
            # 如果用户什么都没有搜，显示所有
            items = Audio.objects.all()
        else:
            # 如果用户搜索了，先获取上面几个的查询集 ==> 有没有key_word
            if description:
                search_dict["description"] = description
            # if status:
            #     search_dict["status"] = Status.objects.get(name=)
            if car_model:
                search_dict["car_model"] = Platform.objects.get(id=car_model).name
            if propulsion:
                search_dict["propulsion"] = PropulsionPower.objects.get(id=propulsion)
            if gearbox:
                search_dict["gearbox"] =  GearBox.objects.get(id=gearbox).name
            if power:
                search_dict["power"] = PropulsionPower.objects.get(id=power)
            if frequency:
                search_dict["frequency__name"] = frequency
            # if tire:
            #     search_dict["tire_model"] = tire

            # 如果没有key_word， items就是这个值
            # items = Audio.objects.filter(**search_dict).frequency_by('-id')
            # items = Audio.objects.filter(**search_dict).order_by('-id')
            result_items = Audio.objects.filter(**search_dict).order_by('-id')
            items = []
            print(len(result_items), tire)
            if tire:
                for tire_file in result_items:
                    if tire in tire_file.tire_model:
                        print("---------1111111111111------------", tire_file.tire_model, tire)

                        items.append(tire_file)
                # result_items = items
            else:
                items = result_items

            if status:
                for status_file in result_items:
                    # print("status:", status, "status_file.status:", status_file.status)
                    if status in status_file.status:
                        items.append(status_file)
                    else:
                        continue
            # else:
                # items = result_items

                # print(status_file.status)

            print("len(items):-----------------------------------", len(items))

            print(key_word)

            if key_word:
                key_word = key_word.replace(' ', '')
                items = items.filter(Q(description__name__icontains=key_word) |
                                     Q(status__icontains=key_word) |
                                     Q(car_model__icontains=key_word) |
                                     Q(propulsion__icontains=key_word) |
                                     Q(gearbox__icontains=key_word) |
                                     Q(power__icontains=key_word) |
                                     # Q(frequency__icontains=key_word) |
                                     Q(tire_model__icontains=key_word)).order_by('-id')

        # 这里是使用什么方法分页查询数据的
        paginator = Paginator(items, limit)
        try:
            page_item = paginator.page(page)
        except PageNotAnInteger:
            page_item = paginator.page(1)
        except EmptyPage:
            page_item = paginator.page(paginator.num_pages)
        items = json.loads(serializers.serialize("json", page_item))

        # 构建数据列表
        res_list = []
        for item in items:
            item["fields"].update(pk=item["pk"])  # 把id添加到列表中,只返回数据字典
            item["fields"]["car_modal"] = item["fields"].pop("car_model")
            item["fields"]["car_engine"] = item["fields"].pop("propulsion")
            item["fields"]["car_gearbox"] = item["fields"].pop("gearbox")
            item["fields"]["detailed_description"] = item["fields"].pop("description")
            item["fields"]["condition"] = item["fields"].pop("status")
            #     item["fields"]["key_parts"] = item["fields"].pop("reason")
            #
            res_list.append(item["fields"])
            # print(item)
        return Response(data={
            "code": 0,
            "msg": "OK",
            "count": paginator.count,  # 数据的条数
            "data": res_list  # 返回的数据列表
        })
        # return Response(data=res_list)


    # 删除
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            folder_path = re.findall(r'(.*/).*', instance.raw_mp3)[0]
            if os.path.isdir(folder_path):
                shutil.rmtree(folder_path)  # 删除磁盘文件
            self.perform_destroy(instance)  # 删除数据库中的数据
            return JsonResponse({"status": True})
        except:
            return JsonResponse({"status": False, "msg": "文件删除失败"})


# 返回等待页面的信息
class Wait(ViewSet):
    @staticmethod
    def get_items(request):
        # 抱怨描述
        description = Description.objects.all()
        brief_description = DescriptionSerializer(description, many=True)

        # 频率范围
        frequency = Frequency.objects.all()
        frequency_range = FrequencySerializer(frequency, many=True)

        # 车型
        car = Platform.objects.filter(parent_id__gte=100)  # 大于等于
        car_model = CarModelSerializer(car, many=True)

        # 发动机
        propulsion = PropulsionPower.objects.filter(parent=None)
        car_engine = PropulsionSerializer(propulsion, many=True)

        # 变速箱
        gearbox = GearBox.objects.all()
        car_gearbox = GearBoxSerializer(gearbox, many=True)

        # 功率
        car_power = PropulsionPower.objects.filter(parent_id__gte=100)
        power = PropulsionSerializer(car_power, many=True)

        # 抱怨库工况
        audio_status = Status.objects.all()
        condition = AudioStatusSerializer(audio_status, many=True)

        data = {
            "brief_description": brief_description.data,
            "frequency_range": frequency_range.data,
            "car_modal": car_model.data,
            "car_engine": car_engine.data,
            "car_gearbox": car_gearbox.data,
            "power": power.data,
            "condition": condition.data
        }
        return Response(data=data)

    @staticmethod
    def search(request):
        return render(request, 'audio/audio_search.html')

    @staticmethod
    def upload(request):
        return render(request, 'audio/audio_upload.html')

    @staticmethod
    def audio_detail(request):
        return render(request, 'audio/audio_detail.html')


def download(request):
    """
    从前端接受请求
    ==> 使用内存读取的方式
    ==> 完成单个数据下载，或者是多个文件打包下载
    """
    file_id = request.GET.get("id", None)
    download_type = request.GET.get("type", None)
    file = Audio.objects.filter(id=file_id).first()

    if file:
        if download_type == "all":
            # 通过内存的方式打包下载文件
            utilities = zip_file.ZipUtilities()
            folder_path = re.findall(r'(.*/).*', file.img)[0]
            folder_name = re.findall(r'.*/Audio/(.*)/.*', file.img)[0]
            utilities.add_folder_to_zip(folder_path, folder_name)

            # utilities.close() # TODO: 这里关闭内存的话，数据没法返回
            response = StreamingHttpResponse(utilities.zip_file, content_type='application/zip')
            response['Content-Disposition'] = 'attachment;filename="{0}.zip"'.format(folder_name)
            return response
        else:
            file_path = getattr(file, download_type)
            file_name = re.findall(r'.*/(.*)', file_path)[0]

            def file_iterator(file_path, chunk_size=512):
                with open(file_path, mode='rb') as f:
                    while True:
                        count = f.read(chunk_size)
                        if count:
                            yield count
                        else:
                            break

            try:
                response = StreamingHttpResponse(file_iterator(file_path))
                response['Content-Type'] = 'application/octet-stream'
                response['Content-Disposition'] = 'attachment;filename="%s"' % (urlquote(file_name))
            except:
                return HttpResponse("Sorry but Not Found the File")
            return response
    return HttpResponse("文件下载失败")


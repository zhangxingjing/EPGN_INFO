import os
import re
import json
from django.db.models import Q
from django.db import transaction
from django.core import serializers
from rest_framework import viewsets
from settings.dev import AUDIO_FILE_PATH
from rest_framework.views import APIView
from rest_framework.response import Response
from fileinfo.models import Platform, PropulsionPower, GearBox
from audio.models import Audio, Description, Frequency, Status
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
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
        frequency_id = request.POST.get("frequency", None)  # 频率
        order = request.POST.get("order", None)  # 阶次
        reason = request.POST.get("key_parts", None)  # 关键零件或因素
        measures = request.POST.get("measure", None)  # 措施
        car_model_id = request.POST.get("car_modal", None)  # 车型
        propulsion_id = request.POST.get("car_engine", None)  # 发动机
        gearbox_id = request.POST.get("car_gearbox", None)  # 变速箱
        power_id = request.POST.get("power", None)  # 功率
        author = request.POST.get("user_name", None)  # 上传人
        tire = request.POST.get("tire", None)  # 轮胎供应商
        status_id = request.POST.get("condition", None)  # 工况
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
        status = Status.objects.get(id=status_id)
        frequency = Frequency.objects.get(id=frequency_id)

        directory_path = AUDIO_FILE_PATH + description.name + "_" + car_model + "/"

        # 获取文件之后处理业务逻辑
        if raw_mp3_name and img_name and complain_mp3_name and description_id and car_model and propulsion and power and gearbox and complaint_feature and status_id and frequency_id and author and tire and measures and reason and details:  # 对于同一个文件的抱怨数据，先看有没有这个抱怨
            # 无--新建文件夹，添加文件
            if not os.path.exists(directory_path):
                os.mkdir(directory_path)

            # 有 --添加到之前的文件夹中
            try:
                with transaction.atomic():  # 数据库回滚
                    try:
                        # raw_mp3
                        new_raw_mp3 = open(directory_path + raw_mp3_name, 'wb+')
                        for chunk in raw_mp3.chunks():
                            new_raw_mp3.write(chunk)
                        new_raw_mp3.close()

                        # image
                        image = open(directory_path + img_name, 'wb+')
                        for chunk in img.chunks():
                            image.write(chunk)
                        image.close()

                        # complain_mp3_name
                        new_complain_mp3 = open(directory_path + complain_mp3_name, 'wb+')
                        for chunk in complain_mp3.chunks():
                            new_complain_mp3.write(chunk)
                        new_complain_mp3.close()

                        # ppt
                        new_ppt = open(directory_path + ppt_name, 'wb+')
                        for chunk in ppt.chunks():
                            new_ppt.write(chunk)
                        new_ppt.close()
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
                          raw_mp3=directory_path + raw_mp3_name,
                          img=directory_path + img_name,
                          complain_mp3=directory_path + complain_mp3_name,
                          ppt=directory_path + ppt_name
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
        search_dict = {}
        if key_word == "":
            key_word = None
        if key_word is None and description is None and status is None and car_model is None and propulsion is None and gearbox is None and power is None and frequency is None and tire is None:
            # 如果用户什么都没有搜，显示所有
            items = Audio.objects.all()
        else:
            # 如果用户搜索了，先获取上面几个的查询集 ==> 有没有key_word
            if description:
                search_dict["description__name"] = description
            if status:
                search_dict["status_name"] = status
            if car_model:
                search_dict["car_model"] = car_model
            if propulsion:
                search_dict["propulsion"] = propulsion
            if gearbox:
                search_dict["gearbox"] = gearbox
            if power:
                search_dict["power"] = power
            if frequency:
                search_dict["frequency__name"] = frequency
            if tire:
                search_dict["tire_model"] = tire

            # 如果没有key_word， items就是这个值
            # items = Audio.objects.filter(**search_dict).frequency_by('-id')
            items = Audio.objects.filter(**search_dict).order_by('-id')

            print(key_word)

            if key_word:
                key_word = key_word.replace(' ', '')
                items = items.filter(Q(description__name__icontains=key_word) |
                                     Q(status__name__icontains=key_word) |
                                     Q(car_model__icontains=key_word) |
                                     Q(propulsion__icontains=key_word) |
                                     Q(gearbox__icontains=key_word) |
                                     Q(power__icontains=key_word) |
                                     Q(frequency__name__icontains=key_word) |
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
            res_list.append(item["fields"])
        # return Response(data={
        #     "code": 0,
        #     "msg": "OK",
        #     "count": paginator.count,  # 数据的条数
        #     "data": res_list  # 返回的数据列表
        # })
        return Response(data=res_list)


# 返回等待页面的信息
class Wait(APIView):
    def get(self, request):
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

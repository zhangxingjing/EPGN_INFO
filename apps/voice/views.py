# Create your views here.
import difflib
import json
import os
import re
import shutil

from django.core import serializers  # 这个必须放在最后
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db import transaction
from django.db.models import Q
from django.http import JsonResponse, HttpResponse, StreamingHttpResponse
from django.shortcuts import render
from django.utils.http import urlquote
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

# from audio.serializers import *
from fileinfo.models import Platform, PropulsionPower, GearBox
from fileinfo.serializers import CarModelSerializer, PropulsionSerializer, GearBoxSerializer
from scripts import zip_file
from settings.dev import VOICE_FILE_PATH
from users.models import User
from voice.models import Voice, Status, Source
from voice.serializers import VoiceSerializer, StatusSerializer, SourceSerializer


class VoiceViewSet(ModelViewSet):
    queryset = Voice.objects.all()
    serializer_class = VoiceSerializer

    # 上传
    def create(self, request, *args, **kwargs):
        # 不再验证前端发送的数据
        author = User.objects.filter(username=request.POST.get("username")).fitrst()
        car_model = Platform.objects.filter(id=request.POST.get("car_model")).first()
        status = request.POST.get("status")
        source = request.POST.get("source")
        propulsion = PropulsionPower.objects.filter(num=request.POST.get("propulsion")).first()
        gearbox = GearBox.objects.filter(id=(int(request.POST.get("gearbox")))).first()
        power = PropulsionPower.objects.filter(num=request.POST.get("power")).first()
        depict = request.POST.get("depict", None)
        remark = request.POST.get("remark", None)
        hdf = request.FILES.get("conplain_file", None)  # 原始数据
        img = request.FILES.get("conplain_pic", None)  # 特征图
        mp3 = request.FILES.get("conplain_audio", None)  # 音频

        hdf_name = str(hdf)  # 文件名
        img_name = str(img)  # 文件名
        mp3_name = str(mp3)  # 文件名

        directory_path = VOICE_FILE_PATH + car_model.name + "_" + source + "/"
        file_num = difflib.get_close_matches(car_model.name + "_" + source, os.walk(VOICE_FILE_PATH))
        if len(file_num) > 1:
            print(int(len(file_num) + 1))

        # 无--新建文件夹，添加文件 -->> 保存文件的时候，文件名+1
        if not os.path.exists(directory_path):
            os.mkdir(directory_path)
        else:
            file_num = difflib.get_close_matches(
                car_model.name + "_" + car_model,
                os.listdir(VOICE_FILE_PATH),
                cutoff=0.94
            )  # /0.94
            if len(file_num) > 0:
                os.mkdir(VOICE_FILE_PATH + car_model.name + "_" + source + "_" + str(len(file_num)))

        # 有 --添加到之前的文件夹中
        try:
            with transaction.atomic():  # 数据库回滚
                try:
                    try:
                        # hdf
                        new_hdf = open(directory_path + hdf_name, 'wb+')
                        for chunk in hdf.chunks():
                            new_hdf.write(chunk)
                        new_hdf.close()
                        new_hdf_info = directory_path + hdf_name
                    except Exception as e:
                        new_hdf_info = None

                    try:
                        # img
                        new_img = open(directory_path + img_name, 'wb+')
                        for chunk in img.chunks():
                            new_img.write(chunk)
                        new_img.close()
                        new_img_info = directory_path + img_name
                    except Exception as e:
                        new_img_info = None

                    try:
                        # complain_mp3_name
                        new_mp3 = open(directory_path + mp3_name, 'wb+')
                        for chunk in mp3.chunks():
                            new_mp3.write(chunk)
                        new_mp3.close()
                        new_mp3_info = directory_path + mp3_name
                    except Exception as e:
                        new_mp3_info = None
                except OSError:
                    return Response(data={"code": 0, "msg": "文件不存在！"})

                Voice.objects.create(
                    author=author,
                    car_model=car_model,
                    status=status,
                    source=source,
                    propulsion=propulsion,
                    gearbox=gearbox,
                    power=power,
                    depict=depict,
                    remark=remark,
                    hdf=new_hdf_info,
                    img=new_img_info,
                    mp3=new_mp3_info
                )

                return Response(data={"code": 1, "msg": "文件上传成功！"})
        except FileExistsError as error:  # 文件操作失败是, 数据库回滚, 同时删除网盘中已上传的文件
            os.remove(directory_path + hdf_name)
            os.remove(directory_path + mp3_name)
            os.remove(directory_path + img_name)
            return Response(data={"code": 0, "msg": error})

    # 检索
    def list(self, request, *args, **kwargs):
        car_model = request.GET.get("car_model")
        status = request.GET.get("status")
        source = request.GET.get("source")
        propulsion = request.GET.get("propulsion")
        gearbox = request.GET.get("gearbox")
        power = request.GET.get("power")
        depict = request.GET.get("depict")
        remark = request.GET.get("remark")

        page = request.GET.get('page', "1")
        limit = int(request.GET.get('limit', "20"))
        key_word = request.GET.get("key_word", None)  # 搜索词

        search_dict = {}
        if key_word == "":
            key_word = None

        # if car_model is None and status is None and source is None and propulsion is None and gearbox is None and power is None and depict is None and remark is None:
        items = Voice.objects.all()  # 如果用户什么都没有搜，显示所有

        # 如果用户搜索了，先获取上面几个的查询集 ==> 有没有key_word
        if car_model:
            search_dict["car_model"] = Platform.objects.get(id=car_model).name
        if propulsion:
            search_dict["propulsion"] = propulsion
        if gearbox:
            search_dict["gearbox"] = GearBox.objects.get(id=gearbox).name
        if power:
            search_dict["power"] = power
        if depict:
            search_dict["depict"] = depict
        if remark:
            search_dict["remark"] = remark
        if source:
            search_dict["source"] = GearBox.objects.get(id=source).name

        result_items = items.filter(**search_dict).order_by('-id')
        if status:
            result_items = result_items.filter(status__icontains=status)

        # 对搜索关键字的检索
        if key_word:
            key_word = (key_word.replace(' ', '')).encode()
            items = result_items.filter(
                Q(description__name__icontains=key_word) |
                Q(status__icontains=key_word) |
                Q(car_model__icontains=key_word) |
                Q(propulsion__icontains=key_word) |
                Q(gearbox__icontains=key_word) |
                Q(power__icontains=key_word) |
                Q(source__icontains=key_word) |
                Q(depict__icontains=key_word) |
                Q(remark__icontains=key_word)
            ).order_by('-id')
        else:
            items = result_items

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
            voice_obj = Voice.objects.get(id=item["pk"])
            item_serializer = VoiceSerializer(voice_obj).data
            res_list.append(item_serializer)

        return Response(data={
            "code": 0,
            "msg": "OK",
            "count": paginator.count,
            "data": res_list
        })

    # 删除
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            folder_path = VOICE_FILE_PATH + instance.car_model.name + "_" + instance.source.name
            if os.path.isdir(folder_path):
                shutil.rmtree(folder_path)  # 删除磁盘文件
            self.perform_destroy(instance)  # 删除数据库中的数据
            return JsonResponse({"status": True})
        except Exception as e:
            return JsonResponse({"status": False, "msg": "文件删除失败"})


class Detail(ViewSet):
    @staticmethod
    def img(request):
        id = request.GET.get("id")
        img_path = Voice.objects.get(id=id).img

        with open(img_path, 'rb') as r:
            img = r.read()
        return HttpResponse(img, content_type='image/png')

    @staticmethod
    def mp3(request):
        id = request.GET.get("id")
        mp3_path = Voice.objects.get(id=id).mp3

        with open(mp3_path, 'rb') as r:
            mp3 = r.read()
        return HttpResponse(mp3, content_type='audio/mp3')


class Wait(ViewSet):
    @staticmethod
    def get_items(request):
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

        # 工况
        status = Status.objects.all()
        condition = StatusSerializer(status, many=True)

        # 声源
        source = Source.objects.all()
        source_list = SourceSerializer(source, many=True)

        # 功率排序
        power_list = sorted(power.data, key=lambda i: int(re.search(r'\d+', i["num"]).group()))
        sort_power_list = sorted(list(set([int(re.search(r'\d+', pd["num"]).group()) for pd in power_list])))
        new_sort_power_list = [str(i) + " KW" for i in sort_power_list]

        # 发动机排序
        int_list = []
        str_list = []
        for ce in car_engine.data:
            if "." in ce["num"]:
                int_list.append(ce["num"])
            else:
                str_list.append(ce["num"])
        sort_car_engine_list = sorted(int_list, key=lambda i: float(re.search(r'\d(\.\d+)?', i).group())) + sorted(str_list)

        data = {
            "car_modal": sorted(car_model.data, key=lambda i: i["name"][0]),
            "car_engine": sort_car_engine_list,
            "car_gearbox": sorted(car_gearbox.data, key=lambda i: i["name"][0]),
            "power": new_sort_power_list,
            "condition": condition.data,
            "source": source_list.data
        }
        return Response(data=data)

    @staticmethod
    def search(request):
        return render(request, 'voice/search.html')

    @staticmethod
    def upload(request):
        return render(request, 'voice/upload.html')

    @staticmethod
    def detail(request):
        return render(request, 'voice/detail.html')


def download(request):
    file_id = request.GET.get("id", None)
    download_type = request.GET.get("type", None)
    file = Voice.objects.filter(id=file_id).first()

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
            if file_path:
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
                except Exception as e:
                    return JsonResponse({"status": False, "msg": "Sorry but Not Found the File"})
                return response
            return JsonResponse({"status": False, "msg": "当前音频的{}文件不存在！".format(download_type)})
    return JsonResponse({"status": False, "msg": "文件下载失败"})

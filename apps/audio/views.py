import os
import json
from django.db import transaction
from rest_framework import viewsets
from django.core import serializers
from django.utils.http import urlquote
from settings.dev import AUDIO_FILE_PATH
from audio.models import Audio, AudioStatus
from django.http import JsonResponse, StreamingHttpResponse
from audio.serializers import AudioSerializer, AudioStatusSerializer
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from fileinfo.models import Platform, PropulsionPower, Direction, GearBox


# 音频文件
class AudioViewSet(viewsets.ModelViewSet):
    queryset = Audio.objects.all()
    serializer_class = AudioSerializer

    def create(self, request, *args, **kwargs):
        # 开始上传文件
        raw_mp3 = request.FILES.get("raw_mp3")  # 文件
        img = request.FILES.get("img")  # 文件
        complain_mp3 = request.FILES.get("complain_mp3")  # 文件
        ppt = request.FILES.get("ppt")  # 文件
        description = request.POST.get("description", None)  # 详细描述
        car_model_id = request.POST.get("car_model", None)  # 车型
        propulsion_id = request.POST.get("propulsion", None)  # 动力总成
        power_id = request.POST.get("power", None)  # 功率
        gearbox_id = request.POST.get('gearbox', None)  # 变速箱
        complaint_feature = request.POST.get("complaint_feature", None)  # 抱怨特征
        status_id = request.POST.get("status", None)  # 工况
        author = request.POST.get("author", None)  # 用户名
        tire = request.POST.get("tire_model", None)  # 轮胎型号
        measures = request.POST.get("measures", None)  # 措施
        reason = request.POST.get("reason", None)  # 关键零件或因素
        detail = request.POST.get("detail", None)  # 抱怨详细描述
        frequency = request.POST.get("frequency", None)  # 频率
        order = request.POST.get("order", None)  # 阶次

        raw_mp3_name = str(raw_mp3)[:-1]  # 文件名
        img_name = str(img)[:-1]  # 文件名
        complain_mp3_name = str(complain_mp3)[:-1]  # 文件名
        ppt_name = str(ppt)[:-1]  # 文件名
        car_model = Platform.objects.get(id=car_model_id).name
        propulsion = PropulsionPower.objects.get(id=propulsion_id).num
        power = PropulsionPower.objects.get(id=power_id).num
        gearbox = GearBox.objects.get(id=gearbox_id).name
        status = Direction.objects.get(id=status_id).name

        directory_path = AUDIO_FILE_PATH + description + "_" + car_model + "/"

        # 获取文件之后处理业务逻辑
        if raw_mp3_name and img_name and complain_mp3_name and description and car_model and propulsion and power and gearbox and complaint_feature and status and author and tire and measures and reason and detail:  # 对于同一个文件的抱怨数据，先看有没有这个抱怨
            # 无--新建文件夹，添加文件
            if not os.path.exists(directory_path):
                # print(directory_path)
                os.mkdir(directory_path)

            # 有--添加到之前的文件夹中
            try:
                with transaction.atomic():  # 数据库回滚
                    try:
                        # raw_mp3
                        new_raw_mp3 = open(directory_path + raw_mp3_name, 'wb+')
                        for chunk in raw_mp3.chunks():
                            new_raw_mp3.write(chunk)
                        new_raw_mp3.close()
                        # # image
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
                        return JsonResponse({"code": 0, "msg": "文件不存在！"})
                    # 写入数据库
                    Audio(description=description,
                          car_model=car_model,
                          propulsion=propulsion,
                          power=power,
                          gearbox=gearbox,
                          complaint_feature=complaint_feature,
                          status=status, author=author,
                          tire_model=tire,
                          measures=measures,
                          reason=reason,
                          details=detail,
                          frequency=frequency,
                          order=order,
                          raw_mp3=raw_mp3_name,
                          complain_mp3=complain_mp3_name,
                          img=img_name,
                          ppt=ppt_name).save()

                    # 上传成功返回当前上传状态
                    return JsonResponse({"code": 1, "msg": "文件上传成功！"})
            except FileExistsError as error:  # 文件操作失败是, 数据库回滚, 同时删除网盘中已上传的原始HDF文件
                os.remove(directory_path + raw_mp3_name)
                os.remove(directory_path + complain_mp3_name)
                os.remove(directory_path + img_name)
                os.remove(directory_path + ppt_name)
                return JsonResponse({"code": 0, "msg": error})
        return JsonResponse({"code": 0, "msg": "丢失重要信息！"})

    def destroy(self, request, *args, **kwargs):
        pass

    def update(self, request, *args, **kwargs):
        pass

    def list(self, request, *args, **kwargs):
        # 1. 返回页面
        # return render(request, 'audio.html')

        # 2. 返回查询集
        # audio = Audio.objects.all()
        # gearbox_info = AudioSerializer(audio, many=True)
        # return Response(gearbox_info.data)

        # 3. 返回搜索查询
        description = request.GET.get("description", None)
        car_model = request.GET.get("car_model", None)
        propulsion = request.GET.get("propulsion", None)
        power = request.GET.get("power", None)
        gearbox = request.GET.get("gearbox", None)
        frequency = request.GET.get("frequency", None)
        order = request.GET.get("order", None)
        reason = request.GET.get("reason", None)
        status = request.GET.get("status", None)
        tire_model = request.GET.get("tire_model", None)

        # 这里是分页查询的page和limit
        page = request.GET.get('page', "1")
        limit = int(request.GET.get('limit', "20"))
        search_dict = {}

        if description is None and car_model is None and propulsion is None and power is None and gearbox is None and frequency is None and order is None and reason is None and status is None and tire_model is None:
            # 如果用户什么都没有搜，显示所有
            items = Audio.objects.all()
        else:
            # 如果用户搜索了，先获取上面几个的查询结 ==> 有没有key_word
            if description:
                search_dict["description"] = description
            if car_model:
                search_dict["car_model"] = car_model
            if propulsion:
                search_dict["propulsion"] = propulsion
            if power:
                search_dict["power"] = power
            if gearbox:
                search_dict["gearbox"] = gearbox
            if frequency:
                search_dict["frequency"] = frequency
            if order:
                search_dict["order"] = order
            if reason:
                search_dict["reason"] = reason
            if status:
                search_dict["status"] = status
            if tire_model:
                search_dict["tire_model"] = tire_model

            # 如果没有key_word， items就是这个值
            items = Audio.objects.filter(**search_dict).order_by('-id')

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
        res = {
            "code": 0,
            "msg": "OK",
            "count": paginator.count,  # 数据的条数
            "data": res_list  # 返回的数据列表
        }
        return JsonResponse(res)


# 音频工况
def audio_status(request):
    audio_status = AudioStatus.objects.all()
    status_info = AudioStatusSerializer(audio_status, many=True)
    status_data = status_info.data
    return JsonResponse({"data": status_data})


# 文件下载
def audio_download(request, pk):
    """
    在这里缺少一个request的参数
    :param request:封装了前端传递过来的请求
    :param pk:当前用户想要下载的文件id
    :return:文件下载状态
    """
    audio = Audio.objects.get(id=pk)
    category = request.GET.get("file_category", None)
    description = audio.description
    car_model = audio.car_model
    directory_path = AUDIO_FILE_PATH + description + "_" + car_model + "/"

    def file_iterator(file_path, chunk_size=512):
        with open(file_path, mode='rb') as f:
            while True:
                count = f.read(chunk_size)
                if count:
                    yield count
                else:
                    break

    # 判断用户在前端选择的是什么文件
    if category is not None:
        filename = ""
        if category == "raw_mp3":
            filename = audio.raw_mp3
        elif category == "img":
            filename = audio.img
        elif category == "complain_mp3":
            filename = audio.complain_mp3
        elif category == "ppt":
            filename = audio.ppt
        try:
            response = StreamingHttpResponse(file_iterator(directory_path + filename))
            response['Content-Type'] = 'application/octet-stream'
            response['Content-Disposition'] = 'attachment;filename="%s"' % (urlquote(filename))
        except:
            return JsonResponse({"code": 0, "msg": "未找到对应文件"})
        return response
    return JsonResponse({"code": 0, "msg": "未指定下载的文件类型"})

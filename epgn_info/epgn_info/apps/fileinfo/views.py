import os
import json
import re
import time
from urllib import parse

from drf_haystack.viewsets import HaystackViewSet
from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
# from epgn_info.epgn_info.settings.devp import FileSavePath    # Nginx
from epgn_info.settings.devp import FILE_SAVE_PATH    # manage
from .serializers import *
from django.db.models import Q
from django.db import transaction
from django.core import serializers
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from django.shortcuts import render, redirect
from django.http import StreamingHttpResponse
# from drf_haystack.viewsets import HaystackViewSet
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from users.models import User
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage


# 前端访问到页面的时候就发送查询`动力总成`的请求, 选择动力总成之后在发送k;`功率`的请求
class PropulsionPowerView(ViewSet):
    def propulsion(self, request):
        # 获取所有动力总成
        # 使用序列化器序列化输出
        propulsion = PropulsionPower.objects.filter(parent=None)
        propulsion_num = PropulsionSerializer(propulsion, many=True)
        return Response(propulsion_num.data)

    def power(self, request, pk):
        # 获取当前动力总成对象
        # 使用序列化器输出
        propulsion_obj = PropulsionPower.objects.get(pk=pk)
        serializer = PowerSerializer(propulsion_obj)
        return Response(serializer.data)

    def every_power(self, request):
        items = PropulsionPower.objects.all()
        data = []
        for i in items:
            if i.parent_id:
                item = {}
                item["id"] = i.id
                item["num"] = i.num
                data.append(item)
        item = ["12", '123']

        return Response(item)


# 前端访问到页面的时候就发送查询`平台`的请求, 选择平台之后在发送`车型`的请求
class PlatformCarModelView(ViewSet):
    def every_platform(self, request):
        platform = Platform.objects.all()
        data = []
        for i in platform:
            if i.parent_id:
                item = {}
                item["id"] = i.id
                item["name"] = i.name
                data.append(item)
        return Response(data)

    def platform(self, request):
        # 获取所有平台
        # 使用序列化器序列化输出
        platform = Platform.objects.filter(parent=None)
        platform_num = PlatformSerializer(platform, many=True)
        return Response(platform_num.data)

    def car_model(self, request, pk):
        # 获取所有动力总成
        # 使用序列化器序列化输出
        car = Platform.objects.filter(pk=pk)
        car_name = CarModelSerializer(car, many=True)
        return Response(car_name.data)


# 前端访问到页面的时候就发送查询`专业方向`的请求, 选择专业方向之后在发送`零部件`的请求, 选择零部件之后再选择`工况`
class DirectionView(ViewSet):
    def parts(self, request):
        # 获取所有动力总成
        # 使用序列化器序列化输出
        parts = Direction.objects.filter(parent=None)
        parts_num = DirectionSerializer(parts, many=True)
        return Response(parts_num.data)

    def power(self, request, pk):
        # 获取当前动力总成对象
        # 使用序列化器输出
        parts_obj = Direction.objects.get(pk=pk)
        serializer = PartsWorkSerializer(parts_obj)
        return Response(serializer.data)


# 前端获取变速箱信息
class GearBoxView(ViewSet):
    def get_gearbox(self, request):
        gearbox = GearBox.objects.all()
        gearbox_info = GearBoxSerializer(gearbox, many=True)
        return Response(gearbox_info.data)


# 文件信息的增删改查： router.register(r'^parse_file', views.FileInfoViewSet)
class FileInfoViewSet(viewsets.ModelViewSet):
    """
    使用Django Rest Framework重写文件的增删改查
    """
    queryset = Fileinfo.objects.all().order_by('-pk')
    serializer_class = FileSerializer

    # 增 : POST /parse_file/
    def create(self, request, *args, **kwargs):
        print(request.method)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        # return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        print("进入了POST请求的数据上传")
        # permission_classes = (IsAuthenticated,)  # 限定必须是已经认证的用户
        if request.method == "GET":
            # 获取session中的数据
            return render(request, 'upload.html')

        a = time.time()
        # 从前端获取的数据
        car_model_id = request.POST.get("car_model", None)  # 车型
        produce = request.POST.get("produce", None)  # 生产阶段
        direction_id = request.POST.get("direction", None)  # 方向
        part_id = request.POST.get("parts", None)  # 零部件
        status_id = request.POST.get("status", None)  # 工况
        author = request.POST.get("author", None)  # 用户名
        car_num = request.POST.get("car_num", None)  # 车号
        propulsion_id = request.POST.get("propulsion", None)  # 动力总成
        power_id = request.POST.get("power", None)  # 功率
        create_date = request.POST.get("date_hash", None)  # 时间
        files = request.FILES.get("file")  # 文件
        # gearbox = request.POST.get('gearbox')
        filename = str(files)

        """这里是非必选参数"""
        kv = request.POST.get('kv')
        EPG = request.POST.get('EPG')
        other = request.POST.get('other')
        gearbox = request.POST.get('gearbox', None)
        other_need = request.POST.get("other_need")

        # save_path = "/media/sf_E_DRIVE/FileInfo/"  # guan-文件存放地址
        # save_path = "/media/sf_E_DRIVE/EPGNINFO/"  # guan2-文件存放地址
        # save_path = "/home/spider-spider/Documents/qwe/"  # home 文件存放地址
        save_path = "/home/zheng/Music/"  # work
        # save_path = "/media/sf_Y_DRIVE/2019_Daten/"  # work

        # 从数据库中查询vue框架绑定的id(车型, 动力总成-功率, 专业方向-零部件-工况)
        car_model = Platform.objects.get(id=car_model_id).name

        # 获取平台
        platform_id = Platform.objects.get(id=car_model_id).parent_id
        platform = Platform.objects.get(id=platform_id).name

        propulsion = PropulsionPower.objects.get(id=propulsion_id).num
        power = PropulsionPower.objects.get(id=power_id).num
        direction = Direction.objects.get(id=direction_id).name
        parts = Direction.objects.get(id=part_id).name

        # 在获取到前端的工况数据时，判断是否是数字 ==> 自定义工况
        status = status_id
        if status_id.isdigit():
            status = Direction.objects.get(id=status_id).name
        print(platform, car_model, direction, parts, status, author, car_num, propulsion, power, create_date, gearbox)
        # return HttpResponse(json.dumps({"data":gearbox}))

        if car_model and direction and parts and status and author and car_num and propulsion and power and create_date and produce and platform:
            # 用户名 + 文件名
            new_name = create_date + "_" + filename
            # 在这里判断下文件格式 ==> 分开保存
            try:
                with transaction.atomic():  # 数据库回滚
                    # 写入本地
                    new_file_hdf = open(save_path + filename[-3:] + "/" + new_name, 'wb+')
                    for chunk in files.chunks():
                        new_file_hdf.write(chunk)
                    new_file_hdf.close()

                    # 写入数据库
                    file_type = "KV" + str(kv) + "EPG" + str(EPG) + "other" + str(other)
                    Fileinfo(platform=platform, carmodel=car_model, direction=direction, parts=parts,
                             status=status, author=author,
                             car_num=car_num, propulsion=propulsion, power=power, create_date=create_date,
                             file_name=new_name, file_type=file_type, other_need=other_need,
                             produce=produce, gearbox=gearbox).save()

                    # 返回文件上传完成
                    res_dict = {
                        "code": 0,
                        "msg": "File upload completed...",
                        "data": {
                            "file_save_path": save_path + new_name,
                            "file_old_name": filename,
                            "file_new_name": new_name,
                        }
                    }
                    print(new_name, "上传时间: ", time.time() - a)
                    return HttpResponse(json.dumps(res_dict))
            except FileExistsError as error:
                os.remove(save_path + filename[-3:] + "/" + new_name)
                res_dict = {
                    "code": 1,
                    "msg": "File upload failed...",
                    "data": {
                        "info": "Server Error..."
                    }
                }
                return HttpResponse(json.dumps(res_dict))

        res_dict = {
            "code": 1,
            "msg": "File upload failed...",
            "data": {
                "info": "Please check the form information...",
            }
        }
        # return render(request, 'upload.html', json.dumps(res_dict))
        # return HttpResponse(res_dict)
        return Response(res_dict, status=status.HTTP_201_CREATED, headers=headers)

    # 删 : DELETE /parse_file/1/
    def destroy(self, request, *args, **kwargs):
        # 在这里删除当前指定的文件： SQL记录 和本地文件
        # TODO: 删除SQL中的数据时候，需要回滚==> 选择使用乐观锁
        with transaction.atomic():
            save_id = transaction.savepoint()  # 创建一个保存点
            try:
                instance = self.get_object()  # 获取当前指定记录的QuerySet
                instance.delete()  # 删除当前指定的记录信息

                print(instance.file_name)  # 拿到当前选择的文件名
                file_path = FileSavePath + instance.file_name
                if os.path.exists(file_path):
                    try:
                        os.remove(file_path)
                        return JsonResponse({
                            "info": "OK",
                            "status": file_path + "删除完成！"
                        })
                    except FileExistsError as e:
                        transaction.savepoint_rollback(save_id)
                        return JsonResponse({
                            "info": e,
                            "status": file_path + "删除失败！"
                        })
                transaction.savepoint_rollback(save_id)
                return JsonResponse({
                    "info": "not find file",
                    "status": file_path + "不存在！"
                })
            # except serializers.ValidationError:
            #     raise

            except Exception as e:
                transaction.savepoint_rollback(save_id)
                raise

    # 改 : PATCH /parse_file/1/
    def update(self, request, *args, **kwargs):
        pass

    # 查 : GET /parse_file/ (/parse_file/1/)
    def list(self, request, *args, **kwargs):
        # 前端传递筛选的额数据, 这里返回符合当前条件的数据 ==> 前端发送请求时候就是这个格式
        carmodel = request.GET.get("carmodel", None)
        propulsion = request.GET.get("propulsion", None)
        power = request.GET.get("power", None)
        discipline = request.GET.get("discipline", None)
        parts = request.GET.get("parts", None)
        key_word = request.GET.get("key_word", None)

        if key_word == "":
            key_word = None

        # 这里是分页查询的page和limit
        page = request.GET.get('page')
        limit = int(request.GET.get('limit'))
        print(page, limit)

        print(carmodel, propulsion, power, discipline, parts, key_word)
        search_dict = {}
        if carmodel is None and propulsion is None and power is None and discipline is None and parts is None and key_word is None:
            # 如果用户什么都没有搜，显示所有
            items = Fileinfo.objects.all()
        else:
            # 如果用户搜索了，先获取上面几个的查询结 ==> 有没有key_word
            if carmodel:
                search_dict["carmodel"] = carmodel
            if propulsion:
                search_dict["propulsion"] = propulsion
            if power:
                search_dict["power"] = power
            if discipline:
                search_dict["direction"] = discipline
            if parts:
                search_dict["parts"] = parts

            # 如果没有key_word， items就是这个值
            items = Fileinfo.objects.filter(**search_dict).order_by('-id')

            # 如果key_word存在，再从上面搜索的QuerySet中搜索
            if key_word:
                print(key_word.replace(' ', ''))
                key_word = key_word.replace(' ', '')
                items = Fileinfo.objects.filter(**search_dict).filter(Q(produce__icontains=key_word) |
                                                                      Q(author__icontains=key_word) |
                                                                      Q(status__icontains=key_word) |
                                                                      Q(file_name__icontains=key_word) |
                                                                      Q(other_need__icontains=key_word)).order_by(
                    '-id')

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


# 使用elasticsearch搜索引擎
class FileSearchViewSet(HaystackViewSet):
    """Fileinfo搜索"""
    # index_models = [Fileinfo]
    # serializer_class = FileIndexSerializer
    pass


# 查询检索 + 分页查询 ==> 表格重载  ==> 使用模糊搜索
def file(request):
    # 前端传递筛选的额数据, 这里返回符合当前条件的数据 ==> 前端发送请求时候就是这个格式
    carmodel = request.GET.get("carmodel", None)
    propulsion = request.GET.get("propulsion", None)
    power = request.GET.get("power", None)
    discipline = request.GET.get("discipline", None)
    parts = request.GET.get("parts", None)
    key_word = request.GET.get("key_word", None)

    if key_word == "":
        key_word = None

    # 这里是分页查询的page和limit
    page = request.GET.get('page')
    limit = int(request.GET.get('limit'))

    print(carmodel, propulsion, power, discipline, parts, key_word)
    search_dict = {}
    if carmodel is None and propulsion is None and power is None and discipline is None and parts is None and key_word is None:
        # 如果用户什么都没有搜，显示所有
        items = Fileinfo.objects.all()
    else:
        # 如果用户搜索了，先获取上面几个的查询结 ==> 有没有key_word
        if carmodel:
            search_dict["carmodel"] = carmodel
        if propulsion:
            search_dict["propulsion"] = propulsion
        if power:
            search_dict["power"] = power
        if discipline:
            search_dict["direction"] = discipline
        if parts:
            search_dict["parts"] = parts

        # 如果没有key_word， items就是这个值
        items = Fileinfo.objects.filter(**search_dict).order_by('-id')

        # 如果key_word存在，再从上面搜索的QuerySet中搜索
        if key_word:
            print(key_word.replace(' ', ''))
            key_word = key_word.replace(' ', '')
            items = Fileinfo.objects.filter(**search_dict).filter(Q(produce__icontains=key_word) |
                                                                  Q(author__icontains=key_word) |
                                                                  Q(status__icontains=key_word) |
                                                                  Q(file_name__icontains=key_word) |
                                                                  Q(other_need__icontains=key_word)).order_by('-id')

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


# 上传文件
# @login_required
def upload(request):
    permission_classes = (IsAuthenticated,)  # 限定必须是已经认证的用户
    if request.method == "GET":
        # 获取session中的数据
        return render(request, 'upload.html')

    a = time.time()
    # 从前端获取的数据
    car_model_id = request.POST.get("car_model", None)  # 车型
    produce = request.POST.get("produce", None)  # 生产阶段
    direction_id = request.POST.get("direction", None)  # 方向
    part_id = request.POST.get("parts", None)  # 零部件
    status_id = request.POST.get("status", None)  # 工况
    author = request.POST.get("author", None)  # 用户名
    car_num = request.POST.get("car_num", None)  # 车号
    propulsion_id = request.POST.get("propulsion", None)  # 动力总成
    power_id = request.POST.get("power", None)  # 功率
    create_date = request.POST.get("date_hash", None)  # 时间
    files = request.FILES.get("file")  # 文件
    # gearbox = request.POST.get('gearbox')
    filename = str(files)

    """这里是非必选参数"""
    kv = request.POST.get('kv')
    EPG = request.POST.get('EPG')
    other = request.POST.get('other')
    gearbox = request.POST.get('gearbox', None)
    other_need = request.POST.get("other_need")

    # save_path = "/media/sf_E_DRIVE/FileInfo/"  # guan-文件存放地址
    # save_path = "/media/sf_E_DRIVE/EPGNINFO/"  # guan2-文件存放地址
    # save_path = "/home/spider-spider/Documents/qwe/"  # home 文件存放地址
    save_path = "/home/zheng/Desktop/demo/"  # work
    # save_path = "/media/sf_Y_DRIVE/2019_Daten/"  # work

    # 从数据库中查询vue框架绑定的id(车型, 动力总成-功率, 专业方向-零部件-工况)
    car_model = Platform.objects.get(id=car_model_id).name

    # 获取平台
    platform_id = Platform.objects.get(id=car_model_id).parent_id
    platform = Platform.objects.get(id=platform_id).name

    propulsion = PropulsionPower.objects.get(id=propulsion_id).num
    power = PropulsionPower.objects.get(id=power_id).num
    direction = Direction.objects.get(id=direction_id).name
    parts = Direction.objects.get(id=part_id).name

    # 在获取到前端的工况数据时，判断是否是数字 ==> 自定义工况
    status = status_id
    if status_id.isdigit():
        status = Direction.objects.get(id=status_id).name
    # print(platform, car_model, direction, parts, status, author, car_num, propulsion, power, create_date, gearbox)
    # return HttpResponse(json.dumps({"data":gearbox}))

    if car_model and direction and parts and status and author and car_num and propulsion and power and create_date and produce and platform:
        # 用户名 + 文件名
        new_name = create_date + "_" + filename
        # 在这里判断下文件格式 ==> 分开保存
        try:
            with transaction.atomic():  # 数据库回滚
                # 写入本地
                # new_file_hdf = open(save_path + filename[-3:] + "/" + new_name, 'wb+')
                new_file_hdf = open(FILE_SAVE_PATH + new_name, 'wb+')
                for chunk in files.chunks():
                    new_file_hdf.write(chunk)
                new_file_hdf.close()

                # 写入数据库
                file_type = "KV" + str(kv) + "EPG" + str(EPG) + "other" + str(other)
                Fileinfo(platform=platform, carmodel=car_model, direction=direction, parts=parts,
                         status=status, author=author,
                         car_num=car_num, propulsion=propulsion, power=power, create_date=create_date,
                         file_name=new_name, file_type=file_type, other_need=other_need,
                         produce=produce, gearbox=gearbox).save()

                # 返回文件上传完成
                res_dict = {
                    "code": 0,
                    "msg": "File upload completed...",
                    "data": {
                        "file_save_path": save_path + new_name,
                        "file_old_name": filename,
                        "file_new_name": new_name,
                    }
                }

                """在这里修改当前用户的用户上传量"""
                # 先获取当前用户的上传量
                # 修改用户上传量
                # 保存数据库
                # 如果用户数据保存失败==>删除当前数据，并返回请求失败
                try:
                    author = User.objects.get(username=author)
                    author.update_files_data += 1
                    author.save(update_fields=['update_files_data'])
                except FileExistsError as error:
                    os.remove(save_path + filename[-3:] + "/" + new_name)
                    res_dict = {
                        "code": 1,
                        "msg": "File upload failed...",
                        "data": {
                            "info": "Server Error..."
                        }
                    }
                    return HttpResponse(json.dumps(res_dict))

                # print(new_name, "上传时间: ", time.time() - a)
                print(author.update_files_data)
                return HttpResponse(json.dumps(res_dict))
        except FileExistsError as error:
            os.remove(save_path + filename[-3:] + "/" + new_name)
            res_dict = {
                "code": 1,
                "msg": "File upload failed...",
                "data": {
                    "info": "Server Error..."
                }
            }
            return HttpResponse(json.dumps(res_dict))

    res_dict = {
        "code": 1,
        "msg": "File upload failed...",
        "data": {
            "info": "Please check the form information...",
        }
    }
    # return render(request, 'upload.html', json.dumps(res_dict))
    return HttpResponse(res_dict)


# 把数据渲染到base.html
def parse_template(request, pk):
    # 平台
    platform = Platform.objects.filter(parent=None)
    platform_num = PlatformSerializer(platform, many=True)
    platforms = platform_num.data

    # 车型
    car = Platform.objects.filter(pk=pk)
    car_name = CarModelSerializer(car, many=True)
    cars = car_name.data

    # 动力总成
    propulsion = PropulsionPower.objects.filter(parent=None)
    propulsion_num = PropulsionSerializer(propulsion, many=True)
    propulsions = propulsion_num.data

    # 功率
    items = PropulsionPower.objects.all()
    data = value_data = []
    for i in items:
        if i.parent_id:  # 先判断i是不是功率
            number = int(re.search(r'\d+', i.num).group())
            if number not in value_data:
                value_data.append(number)
    data.sort()
    power = data

    # 专业方向
    parts = Direction.objects.filter(parent=None)
    parts_num = DirectionSerializer(parts, many=True)
    parts = parts_num.data

    data = {
        "platforms": platforms,
        "cars": cars,
        "propulsions": propulsions,
        "powers": power,
        "parts": parts,
    }
    return render(request, 'datainfo.html', data)


# 文档查看
def word(request):
    file = open('/home/spider/Documents/Project/EPGN_INFO/epgn_front_end/word/使用说明文档.docx', 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="EPGN_INFO.docx"'
    return response


# 文件下载
# @login_required
def file_down(request, pk):
    """前段在发送请求的时候应该是从cookie里面拿到的id, 后端查询数据库，拿到文件名，拼接绝对路径"""
    file_name = Fileinfo.objects.get(id=pk).file_name  # 从数据库里面查询当前id的文件名
    file_path = "/home/zheng/Desktop/demo/R_HDF/" + file_name  # guan文件位置

    # if os.path.isfile(file_path):  # 老数据
    #     # 判断下载文件是否存在
    #     # file_path = "/media/sf_E_DRIVE/FileInfo/hdf/" + file_name
    # else:  # 网盘
    #     file_path = "/media/sf_Y_DRIVE/2019_Daten/hdf/" + file_name

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
        # 设置响应头
        # StreamingHttpResponse将文件内容进行流式传输，数据量大可以用这个方法
        response = StreamingHttpResponse(file_iterator(file_path))
        # 以流的形式下载文件,这样可以实现任意格式的文件下载
        response['Content-Type'] = 'application/octet-stream'
        # Content-Disposition就是当用户想把请求所得的内容存为一个文件的时候提供一个默认的文件名
        # response['Content-Disposition'] = 'attachment;filename="{}"'.format(file_name)
        from django.utils.http import urlquote
        response['Content-Disposition'] = 'attachment;filename="%s"' % (urlquote(file_name))
        """在这里修改用户下载数据量"""
        try:
            # 首先获取用户id
            # 用户下载数据时，把当前用户信息提交到后台
            author = "zheng"
            author = User.objects.get(username=author)
            author.download_files_data += 1
            author.save(update_fields=['download_files_data'])
        except:
            return HttpResponse("Sorry but Data storage error")
    except:
        return HttpResponse("Sorry but Not Found the File")
    return response

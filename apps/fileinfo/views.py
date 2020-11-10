import datetime
import json
import os
import re
import threading

from django.core import serializers
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db import transaction
from django.db.models import Q
from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.shortcuts import render
from django.utils.http import urlquote
from django.views import View
from pymysql import DatabaseError
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet, ModelViewSet

from settings.dev import FILE_HEAD_PATH, FILE_READ_PATH
from users.models import User
from .models import Fileinfo
from .serializers import *

lock = threading.Lock()  # 创建一个锁的实例


# 前端访问到页面的时候就发送查询`动力总成`的请求, 选择动力总成之后在发送k;`功率`的请求
class PropulsionPowerView(ViewSet):
    def propulsion(self, request):
        propulsion = PropulsionPower.objects.filter(parent=None)
        propulsion_num = PropulsionSerializer(propulsion, many=True)
        return Response(propulsion_num.data)

    def power(self, request, pk):
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
        platform = Platform.objects.filter(parent=None)
        platform_num = PlatformSerializer(platform, many=True)
        return Response(platform_num.data)

    def car_model(self, request, pk):
        car = Platform.objects.filter(pk=pk)
        car_name = CarModelSerializer(car, many=True)
        return Response(car_name.data)


class DirectionView(ViewSet):
    def parts(self, request):
        parts = Direction.objects.filter(parent=None)
        parts_num = DirectionSerializer(parts, many=True)
        return Response(parts_num.data)

    def power(self, request, pk):
        parts_obj = Direction.objects.get(pk=pk)
        serializer = PartsWorkSerializer(parts_obj)
        return Response(serializer.data)


# 前端获取变速箱信息
class GearBoxView(ViewSet):
    def get_gearbox(self, request):
        gearbox = GearBox.objects.all()
        gearbox_info = GearBoxSerializer(gearbox, many=True)
        return Response(gearbox_info.data)


# 模板渲染: url(r'^datainfo/(?P<pk>\d+)/$', DataInfo.as_view()),
class DataInfo(View):
    def get(self, request, pk):
        # 平台
        platform = Platform.objects.filter(parent=None)
        platform_num = PlatformSerializer(platform, many=True)

        # 车型
        car = Platform.objects.filter(pk=pk)
        car_name = CarModelSerializer(car, many=True)

        # 动力总成
        propulsion = PropulsionPower.objects.filter(parent=None)
        propulsion_num = PropulsionSerializer(propulsion, many=True)

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

        data = {
            "platforms": platform_num.data,
            "cars": car_name.data,
            "propulsions": propulsion_num.data,
            "powers": power,
            "parts": parts_num.data,
        }
        return render(request, 'file/file_search.html', data)


# 文件信息的增删改查： router.register(r'^parse_file', views.FileInfoViewSet)
class Search(View):
    def get(self, request):
        power = request.GET.get("power", None)
        parts = request.GET.get("parts", None)
        key_word = request.GET.get("key_word", None)
        car_model = request.GET.get("car_model", None)
        propulsion = request.GET.get("propulsion", None)
        discipline = request.GET.get("discipline", None)
        page = request.GET.get('page', "1")
        limit = int(request.GET.get('limit', "20"))
        search_dict = {}

        if key_word == "":
            key_word = None

        if car_model is None and propulsion is None and power is None and discipline is None and parts is None and key_word is None:
            # 如果用户什么都没有搜，显示所有
            items = Fileinfo.objects.all()
        else:
            # 如果用户搜索了，先获取上面几个的查询结 ==> 有没有key_word
            if car_model:
                search_dict["carmodel"] = car_model
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
                key_word = key_word.replace(' ', '')
                items = Fileinfo.objects.filter(**search_dict).filter(Q(produce__icontains=key_word) |
                                                                      Q(author__icontains=key_word) |
                                                                      Q(file_type__icontains=key_word) |
                                                                      Q(parts__icontains=key_word) |
                                                                      Q(platform__icontains=key_word) |
                                                                      Q(power__icontains=key_word) |
                                                                      Q(other_need__icontains=key_word) |
                                                                      Q(gearbox__icontains=key_word) |
                                                                      Q(status__icontains=key_word) |
                                                                      Q(file_name__icontains=key_word) |
                                                                      Q(other_need__icontains=key_word) |
                                                                      Q(direction__icontains=key_word)).order_by('-id')

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


# 文件状态: url(r'^file_status/$', change_file_status),
def change_file_status(request):
    file_name = request.GET.get("file")
    file = Fileinfo.objects.get(file_name=file_name)
    file.file_status = "是"
    file.save()
    return JsonResponse({"msg": "OK!"})


# 文件操作: router.register(r'upload', FileInfoViewSet)
class Upload(View):
    def get(self, request):
        # TODO: 在这里直接渲染
        return render(request, 'file/file_upload.html')

    def post(self, request):
        """
        用户的上传下载都需要先登录, 在这两个操作之前先进行用户身份认证
        :param request: 数据携带的参数信息
        :return: 文件和文件信息存储的状态
        """
        # 从前端获取的数据l
        files = request.FILES.get("file")  # 文件

        # 調整filename命名方式
        try:
            luan_filename = str(files).replace('%', '')
            x = re.findall(r'(.*)\.(.*.hdf)', luan_filename)
            try:
                filename = (x[0][0] + x[0][1]).replace("?", "")
            except:
                filename = x[0][0].replace("?", "")
        except:
            filename = str(files)

        author = request.POST.get("author", None)  # 用户名
        part_id = request.POST.get("parts", None)  # 零部件
        power_id = request.POST.get("power", None)  # 功率
        gearbox = request.POST.get('gearbox', None)
        car_num = request.POST.get("car_num", None)  # 车号
        produce = request.POST.get("produce", None)  # 生产阶段
        status_id = request.POST.get("status", None)  # 工况
        create_date = request.POST.get("date_hash", None)  # 时间
        car_model_id = request.POST.get("car_model", None)  # 车型
        direction_id = request.POST.get("direction", None)  # 方向
        propulsion_id = request.POST.get("propulsion", None)  # 动力总成

        # 非必选参数
        kv = request.POST.get('kv')
        EPG = request.POST.get('EPG')
        other = request.POST.get('other')
        other_need = request.POST.get("other_need")

        # 获取前端发送的参数
        parts = Direction.objects.get(id=part_id).name
        car_model = Platform.objects.get(id=car_model_id).name
        power = PropulsionPower.objects.get(id=power_id).num
        direction = Direction.objects.get(id=direction_id).name
        platform_id = Platform.objects.get(id=car_model_id).parent_id
        platform = Platform.objects.get(id=platform_id).name
        propulsion = PropulsionPower.objects.get(id=propulsion_id).num

        # 在获取到前端的工况数据时，判断是否是数字 ==> 自定义工况
        status = status_id
        if status_id.isdigit():
            status = Direction.objects.get(id=status_id).name

        if car_model and direction and parts and status and author and car_num and propulsion and power and create_date and produce and platform and gearbox:
            # new_name = create_date + "_" + filename  # 用户名 + 文件名
            new_name = (create_date + "_" + car_model + "_" + car_num + "_" + status.replace('/', '／') + "_" + filename).replace('?', '')  # 用户名 + 文件名
            print(new_name)
            # 在这里判断下文件格式 ==> 分开保存
            try:
                with transaction.atomic():  # 数据库回滚
                    new_file_hdf = open(FILE_HEAD_PATH + new_name, 'wb+')
                    # 写入本地
                    for chunk in files.chunks():
                        new_file_hdf.write(chunk)
                    new_file_hdf.close()

                    # 写入数据库
                    file_type = "KV" + str(kv) + "EPG" + str(EPG) + "other" + str(other)
                    Fileinfo(platform=platform, carmodel=car_model, direction=direction, parts=parts, status=status,
                             author=author, car_num=car_num, propulsion=propulsion, power=power,
                             create_date=create_date, file_name=new_name, file_type=file_type, other_need=other_need,
                             produce=produce, gearbox=gearbox).save()

                    # 从用户上传的数据中获取当前文件中的头文件
                    nowHDF = open(FILE_HEAD_PATH + new_name, 'rb')
                    HDF_header = ""
                    for content in nowHDF.readlines():
                        try:
                            HDF_header += content.decode()
                        except:
                            continue
                        if content == b';#tag:                             \r\n' or content == b';#tag:                             \\r\\n':
                            break

                    # 将头文件中的通道信息, 返回给前端
                    channel_list = re.findall(r'name str:\W+(\w+)', HDF_header, re.S)
                    res_dict = {
                        "code": 0,
                        "data": {
                            "file_save_path": FILE_HEAD_PATH + new_name,
                            "file_old_name": filename,
                            "file_new_name": new_name,
                            "file_channel_list": channel_list
                        }
                    }

                    # 在这里修改当前用户的用户上传量, 上传失败则删除文件
                    try:
                        lock.acquire()
                        author = User.objects.get(username=author)
                        author.update_files_data += 1
                        author.save(update_fields=['update_files_data'])
                        lock.release()
                    except FileExistsError as error:
                        os.remove(FILE_HEAD_PATH + filename[-3:] + "/" + new_name)
                        res_dict = {
                            "code": 1,
                            "msg": FileExistsError
                        }
                        return HttpResponse(json.dumps(res_dict))

                    # 上传成功返回当前上传状态
                    return HttpResponse(json.dumps(res_dict))
            except FileExistsError as error:  # 文件操作失败是, 数据库回滚, 同时删除网盘中已上传的原始HDF文件
                os.remove(FILE_HEAD_PATH + filename[-3:] + "/" + new_name)
                res_dict = {
                    "code": 1,
                    "msg": DatabaseError
                }
                return HttpResponse(json.dumps(res_dict))

        res_dict = {
            "code": 1,
            "msg": "Please check the form information"
        }
        return HttpResponse(res_dict)


# 文档查看: url(r'^help/$', Word.as_view()),
class Word(View):
    @staticmethod
    def get(request):
        # file_path = BASE_DIR + "/static/word/.车辆信息查询表.xlsx"
        file_path = "/media/sf_E_DRIVE/Temp_Data/车辆信息查询表/车辆信息查询表.xlsx"
        # file = open(file_path, 'rb')
        # response = FileResponse(file)
        # response['Content-Type'] = 'application/octet-stream'
        file_name = "{}_车辆信息查询表.xlsx".format(str(datetime.date.today()))

        # response['Content-Disposition'] = 'attachment;filename="%s"' % (urlquote(file_name))
        # return response

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


# 文件下载：url(r'^download/(?P<pk>\d+)/$', Download.as_view()),
class Download(View):
    def get(self, request, pk):
        user_id = request.GET.get("user_id")
        file_name = Fileinfo.objects.get(id=pk).file_name
        file_path = FILE_HEAD_PATH + file_name

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
            try:
                with transaction.atomic():  # 数据库回滚
                    # 用户下载量+1
                    lock.acquire()  # 加锁
                    author = User.objects.get(id=user_id)  # 当前在线的用户
                    author.download_files_data += 1
                    author.save(update_fields=['download_files_data'])

                    # 试验员的浏览量+1
                    try:
                        uploader_name = Fileinfo.objects.get(id=pk).author  # 反向查询
                        uploader = User.objects.get(username=uploader_name)
                        uploader.views += 1
                        uploader.save(update_fields=['views'])
                    except:
                        print("Sorry but Data storage error")
                    lock.release()  # 解锁
            except:
                return HttpResponse("Sorry but Data storage error")
        except:
            return HttpResponse("Sorry but Not Found the File")
        return response


# 处理通道：router.register(r'^channel', ChannelViewSet)
class ChannelViewSet(ModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelNameSerializer

    def create(self, request, *args, **kwargs):
        # TODO: 这里的代码需要重写
        # 从前端数据中, 获取文件对应的通道信息
        text = request.body.decode()
        body_json = json.loads(text)
        file_dict = body_json["data"]

        # 对比数据库, 没有的添加得到数据库中
        try:
            with transaction.atomic():  # 数据库回滚
                for key, value in file_dict.items():
                    print(key, value)
                    sql_status_id = 1
                    for status in value:  # 对同一标准通道的多个通道名进行修改==>value是非标准写法，key是标准写法
                        sql_channel = Channel.objects.filter(name=status)

                        # 如果其他写法不在数据库中, 实时新建一条其他写法的数据
                        if len(sql_channel) == 0:
                            new_other_channel = Channel()
                            new_other_channel.name = status
                            new_other_channel.parent_id = Channel.objects.get(name=key).id

                            sum_other_channel = Channel.objects.filter(
                                id=Channel.objects.get(name=key).id).count() - 1  # 当前标准通道其他写法的数量

                            if sum_other_channel == 0:
                                new_other_channel.id = int(
                                    str(Channel.objects.get(name=key).id) + "0" + str(sql_status_id))
                            else:
                                if sum_other_channel < 9:
                                    new_other_channel.id = int(
                                        str(Channel.objects.get(name=key).id) + "0" +
                                        str(sum_other_channel) + str(sql_status_id)
                                    )

                            new_other_channel.parent_id = Channel.objects.get(name=key).id
                            print(new_other_channel.name, new_other_channel.id, new_other_channel.parent_id)
                            new_other_channel.save()
                            sql_status_id += 1
                        else:
                            print("当前是全新通道，需要添加的！")
                res_dict = {"code": 0, "msg": "通道别名添加完成！"}
        except FileExistsError:
            return Response(status=200, data=DatabaseError)
        return Response(res_dict)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        items = []
        for data in serializer.data:
            item = {}
            item["label"] = item["value"] = data["name"]
            item["children"] = data["subs"]
            items.append(item)
        return Response(items)


def delete_file(request):
    body = request.body
    body_str = body.decode()
    file_list = json.loads(body_str)["fileList"]
    for file_ in list(set(file_list)):
        file = Fileinfo.objects.get(id=file_)
        with transaction.atomic():
            save_id = transaction.savepoint()  # 创建一个保存点
            try:
                file.delete()  # 删除当前指定的记录信息
                file_path = FILE_READ_PATH + file.file_name
                if os.path.exists(file_path):
                    try:
                        os.remove(file_path)
                        # 修改用户删除文件之后的文件上传量
                        user = User.objects.get(username=file.author)
                        user.update_files_data -= 1
                        user.save()
                        res = {
                            "info": 0,
                            "status": file_path + "删除完成！"
                        }
                    except FileExistsError as e:
                        # transaction.savepoint_rollback(save_id)   # 还原到保存点
                        res = {
                            "info": e,
                            "status": file_path + "删除失败！"
                        }
                else:
                    # transaction.savepoint_rollback(save_id)
                    res = {
                        "info": "not find file",
                        "status": file_path + "不存在！"
                    }
            except Exception as e:
                transaction.savepoint_rollback(save_id)
                raise
    return JsonResponse(res)

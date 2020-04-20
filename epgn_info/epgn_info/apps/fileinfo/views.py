import os
import json
import re
import time
import h5py
from pymysql import DatabaseError

from .serializers import *
from django.views import View
from users.models import User
from epgn_info.scripts.readHDF import read_hdf
from django.db import transaction
from django.db.models import Q, Max
from django.core import serializers
from django.shortcuts import render
from rest_framework.response import Response
from drf_haystack.viewsets import HaystackViewSet
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required
from rest_framework.viewsets import ViewSet, ModelViewSet
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import HttpResponse, JsonResponse, FileResponse, StreamingHttpResponse
from epgn_info.epgn_info.settings.devp import FILE_SAVE_PATH  # Nginx


# from epgn_info.settings.devp import FILE_SAVE_PATH  # manage


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
class FileInfoViewSet(ModelViewSet):
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
        page = request.GET.get('page', "1")
        limit = int(request.GET.get('limit', "20"))
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


# 用户对于文件的操作
class ParseFile(View):
    def get(self, request):
        return render(request, 'upload.html')

    # 上传文件
    # @login_required
    def post(self, request):
        """
        用户的上传下载都需要先登录, 在这两个操作之前先进行用户身份认证
        :param request: 数据携带的参数信息
        :return: 文件和文件信息存储的状态
        """
        permission_classes = (IsAuthenticated,)  # 限定必须是已经认证的用户

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
        gearbox = request.POST.get('gearbox')
        filename = str(files)

        # 这里是非必选参数
        kv = request.POST.get('kv')
        EPG = request.POST.get('EPG')
        other = request.POST.get('other')
        other_need = request.POST.get("other_need")

        # 从数据库中查询vue框架绑定的id(车型, 动力总成-功率, 专业方向-零部件-工况)
        car_model = Platform.objects.get(id=car_model_id).name

        # 获取前端发送的参数
        parts = Direction.objects.get(id=part_id).name
        power = PropulsionPower.objects.get(id=power_id).num
        direction = Direction.objects.get(id=direction_id).name
        platform_id = Platform.objects.get(id=car_model_id).parent_id
        platform = Platform.objects.get(id=platform_id).name
        propulsion = PropulsionPower.objects.get(id=propulsion_id).num

        # 在获取到前端的工况数据时，判断是否是数字 ==> 自定义工况
        status = status_id
        if status_id.isdigit():
            status = Direction.objects.get(id=status_id).name

        if car_model and direction and parts and status and author and car_num and propulsion and power and create_date and produce and platform:
            new_name = create_date + "_" + filename  # 用户名 + 文件名
            # 在这里判断下文件格式 ==> 分开保存
            try:
                with transaction.atomic():  # 数据库回滚
                    new_file_hdf = open(FILE_SAVE_PATH + new_name, 'wb+')
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
                    nowHDF = open(FILE_SAVE_PATH + new_name, 'rb')
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
                    # key_list = re.findall(r'channel definition:\W+(\d+)', HDF_header, re.S)
                    res_dict = {
                        "code": 0,
                        "data": {
                            "file_save_path": FILE_SAVE_PATH + new_name,
                            "file_old_name": filename,
                            "file_new_name": new_name,
                            "file_channel_list": channel_list
                        }
                    }

                    # 在这里修改当前用户的用户上传量, 上传失败则删除文件
                    try:
                        author = User.objects.get(username=author)
                        author.update_files_data += 1
                        author.save(update_fields=['update_files_data'])
                    except FileExistsError:
                        os.remove(FILE_SAVE_PATH + filename[-3:] + "/" + new_name)
                        res_dict = {
                            "code": 1,
                            "msg": FileExistsError
                        }
                        return HttpResponse(json.dumps(res_dict))

                    # 上传成功返回当前上传状态
                    return HttpResponse(json.dumps(res_dict))
            except DatabaseError:  # 文件操作失败是, 数据库回滚, 同时删除网盘中已上传的原始HDF文件
                os.remove(FILE_SAVE_PATH + filename[-3:] + "/" + new_name)
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

    def put(self, request):
        """
        将其他写法的通道名修改为标准通道名, 并将文件中的通道名修改为标准通道名
        :param request: 又用户修改之后的标准通道名和不标准通道名
        :return: 文件中通道名的修改状态
        """
        # 从前端数据中, 获取文件对应的通道信息
        text = request.body.decode()
        body_json = json.loads(text)
        file_dict = body_json["data"]
        msg = ""
        # 对比数据库, 没有的添加得到数据库中
        try:
            with transaction.atomic():  # 数据库回滚
                # for key, value in file_dict.items():
                #     channel_norm = Channel.objects.filter(Q(parent_id=None) & Q(name=key))
                #     channel_norm_len = len(channel_norm)
                #
                #     如果标准通道不存在,我们实时创建一个
                #     if channel_norm_len == 0:
                #         new_norm_channel = Channel()
                #         # parent_id=None 的 最大 ID
                #         new_norm_sql_id = int(Channel.objects.filter(parent_id=None).aggregate(Max('id'))["id__max"]) + 100
                #         new_norm_channel.id = new_norm_sql_id
                #         # print(new_norm_channel.id)
                #         new_norm_channel.name = key
                #         new_norm_channel.parent_id = None
                #
                #         new_norm_channel.save()
                #
                #     通过标准通道, 拿到这个标准通道的其他写法,
                #     for other_channel_info in value:
                #         sql_channel = Channel.objects.filter(name=other_channel_info)
                #         sql_channel_len = len(sql_channel)
                #
                #         # 如果其他写法不在数据库中, 实时新建一条其他写法的数据
                #         if sql_channel_len == 0:
                #             print(other_channel_info)
                #             other_channel_data = Channel()
                #             other_channel_data.name = other_channel_info
                #             other_channel_data.parent_id = Channel.objects.get(Q(parent_id=None) & Q(name=key)).id
                #             other_channel_data.save()
                #         else:
                #             continue

                for key, value in file_dict.items():
                    sql_channel = Channel.objects.filter(name=value)
                    sql_channel_len = len(sql_channel)

                    # 如果其他写法不在数据库中, 实时新建一条其他写法的数据
                    if sql_channel_len == 0:
                        new_other_channel = Channel()
                        new_other_channel.name = value
                        # new_other_channel.parent_id = Channel.objects.get(Q(parent_id=None) & Q(name=key)).id
                        new_other_channel.parent_id = Channel.objects.get(name=key).id
                        new_other_channel.save()

                # 从前端数据中,获取本次需要操作的文件列表, 修改文件中的通道名
                file_list = body_json["filelist"]
                for file in set(file_list):
                    # 在这里拿到文件中通道名, 进行修改 ==> 可以使用多任务进行优化
                    read_info = h5py.File(FILE_SAVE_PATH + file, 'r+')
                    for channel_key in read_info.keys():
                        # 找到当前通道对应的标准通道
                        try:
                            read_hdf_channel = re.search(r'data_(.*)', channel_key, re.S).group(1)
                        except:
                            read_hdf_channel = channel_key

                        norm_channel_key = Channel.objects.filter(name=read_hdf_channel)  # 从数据查询数据返回空[]

                        # 判断当前通道名 是不是 标准写法
                        if len(norm_channel_key) == 0:
                            if norm_channel_key[0].parent_id is not None:
                                # 不是标准写法
                                change_channel_to_norm = Channel.objects.get(id=norm_channel_key[0].parent_id)
                                norm_channel_key.name = change_channel_to_norm.name

                            # 跳过已修改的部分
                            if norm_channel_key.name == channel_key:
                                continue

                            # 最后修改文件中的通道名
                            read_info[norm_channel_key.name] = read_info[channel_key]
                            del read_info[channel_key]
                            read_info.update({norm_channel_key: read_info.pop(channel_key)})
                            read_info[norm_channel_key] = read_info[channel_key].value
                            res_dict = {
                                "code": 0,
                                "msg": "File Channel Change to Success"
                            }
                        else:
                            # read_info[norm_channel_key.name] = read_info[channel_key]
                            # del read_info[channel_key]
                            # read_info.update({norm_channel_key: read_info.pop(channel_key)})
                            # read_info[norm_channel_key] = read_info[channel_key].value
                            # 当文件通道信息修改失败, 向前端返回当前文件处理结果 ==> 同时删除本地文将+数据库信息
                            os.remove(FILE_SAVE_PATH + file)
                            res_dict = {
                                "code": 1,
                                "msg": DatabaseError
                            }
                            raise DatabaseError
        except FileExistsError:
            return JsonResponse({"code": 1, "msg": DatabaseError})
            # 返回前端通道修改的状态
        return JsonResponse(res_dict)


# SQL中Channel的增删改查
class CheckChannel(View):

    def get(self, request):
        """
        从前端获取当前文件中的通道信息，判断是否在SQL中：
            1. 在： 返回标准通道名
            2. 不在： 让用户选择标准通道，然后将标准-不标准的传给后台
            3. 后台接受到标准-不标准数据，将其写入数据库
        """
        # 从前端接受一个文件列表，后台通过读取文件列表中的文件，将文件中的通道进行对比
        # json
        text = request.body.decode()
        body_json = json.loads(text)
        file_list = body_json["fileList"]
        # params
        # file_list = request.POST.get("fileList", None)

        if file_list:
            B_channel_dict = {}
            for filename in file_list:
                channel_dict, items = read_hdf(filename)
                # print(channel_dict)
                # dict() 是可变类型，迭代的时候直接操作
                for key, value in channel_dict.items():
                    sql_channel_list = Channel.objects.filter(name=value)
                    if sql_channel_list:
                        # 当用户上传的数据在SQL中，就正常取值
                        try:
                            B_channel_dict.update({key: sql_channel_list[0].parent.name})
                        except:
                            B_channel_dict.update({key: value})
                    else:
                        # 不在时，根据用户选择的标准通道，配置正确的SQL记录
                        B_channel_dict.update({key: value})

            return JsonResponse({"status": 200, "data": B_channel_dict})
        return JsonResponse({"status": 400, "msg": "后台未接收到数据！"})

    def patch(self, request):
        text = request.body.decode()
        body_json = json.loads(text)
        channel_list = body_json["channel_list"]

        print(channel_list)
        channel_none_list = []
        channel_norm_list = []
        for channel_name in channel_list:
            channel = Channel.objects.filter(name=channel_name)
            if len(channel) < 1:
                channel_none_list.append(channel_name)
        channel_norm = Channel.objects.filter(parent_id=None)
        for channel_ in channel_norm:
            channel_norm_list.append(channel_.name)
        return JsonResponse({"status": 200, "data": channel_none_list, "norm_data": channel_norm_list})

    def post(self, request):
        text = request.body.decode()
        body_json = json.loads(text)
        channel_list = body_json["NewChannel"]
        for channel_dict in channel_list:
            with transaction.atomic():  # 数据库回滚
                channel_data = Channel()
                # print(list(channel_dict.values())[0], list(channel_dict.keys())[0])
                channel_data.name = list(channel_dict.values())[0]

                channel_data_parent = Channel.objects.filter(name=list(channel_dict.keys())[0])

                if channel_data_parent:
                    # 前端数据在SQL中有主键时，我们
                    channel_data.parent_id = channel_data_parent[0].id
                    channel_data.save()
                else:
                    # 当前端发来的数据中，不在标准写法，也不再其他写法中 ==> 我们新建一条数据
                    NewParentChannel = Channel()
                    # print(Channel.objects.filter(parent=None).aggregate(Max("id")))  # {'id__max': 25500}
                    NewParentChannel.id = int(Channel.objects.filter(parent=None).aggregate(Max("id"))["id__max"]) + 100
                    NewParentChannel.name = list(channel_dict.keys())[0]

                    channel_data.parent_id = NewParentChannel.id

                    # print(NewParentChannel.id, NewParentChannel.name)
                    # print(channel_data.parent_id, channel_data.name)

                    NewParentChannel.save()
                    channel_data.save()

        return JsonResponse({"status": 200, "msg": "OK"})


# 使用elasticsearch搜索引擎
class FileSearchViewSet(HaystackViewSet):
    """Fileinfo搜索"""
    # index_models = [Fileinfo]
    # serializer_class = FileIndexSerializer
    pass


# 查询检索 + 分页查询 ==> 表格重载  ==> 使用模糊搜索
# def file(request):
#     # 前端传递筛选的额数据, 这里返回符合当前条件的数据 ==> 前端发送请求时候就是这个格式
#     carmodel = request.GET.get("carmodel", None)
#     propulsion = request.GET.get("propulsion", None)
#     power = request.GET.get("power", None)
#     discipline = request.GET.get("discipline", None)
#     parts = request.GET.get("parts", None)
#     key_word = request.GET.get("key_word", None)
#
#     if key_word == "":
#         key_word = None
#
#     # 这里是分页查询的page和limit
#     page = request.GET.get('page')
#     limit = int(request.GET.get('limit'))
#
#     print(carmodel, propulsion, power, discipline, parts, key_word)
#     search_dict = {}
#     if carmodel is None and propulsion is None and power is None and discipline is None and parts is None and key_word is None:
#         # 如果用户什么都没有搜，显示所有
#         items = Fileinfo.objects.all()
#     else:
#         # 如果用户搜索了，先获取上面几个的查询结 ==> 有没有key_word
#         if carmodel:
#             search_dict["carmodel"] = carmodel
#         if propulsion:
#             search_dict["propulsion"] = propulsion
#         if power:
#             search_dict["power"] = power
#         if discipline:
#             search_dict["direction"] = discipline
#         if parts:
#             search_dict["parts"] = parts
#
#         # 如果没有key_word， items就是这个值
#         items = Fileinfo.objects.filter(**search_dict).order_by('-id')
#
#         # 如果key_word存在，再从上面搜索的QuerySet中搜索
#         if key_word:
#             print(key_word.replace(' ', ''))
#             key_word = key_word.replace(' ', '')
#             items = Fileinfo.objects.filter(**search_dict).filter(Q(produce__icontains=key_word) |
#                                                                   Q(author__icontains=key_word) |
#                                                                   Q(status__icontains=key_word) |
#                                                                   Q(file_name__icontains=key_word) |
#                                                                   Q(other_need__icontains=key_word)).order_by('-id')
#
#     # 这里是使用什么方法分页查询数据的
#     paginator = Paginator(items, limit)
#     try:
#         page_item = paginator.page(page)
#     except PageNotAnInteger:
#         page_item = paginator.page(1)
#     except EmptyPage:
#         page_item = paginator.page(paginator.num_pages)
#
#     items = json.loads(serializers.serialize("json", page_item))
#
#     # 构建数据列表
#     res_list = []
#
#     for item in items:
#         item["fields"].update(pk=item["pk"])  # 把id添加到列表中,只返回数据字典
#         res_list.append(item["fields"])
#
#     res = {
#         "code": 0,
#         "msg": "OK",
#         "count": paginator.count,  # 数据的条数
#         "data": res_list  # 返回的数据列表
#     }
#
#     return JsonResponse(res)


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
def file_down(request, pk):
    """
    在这里缺少一个request的参数
    :param request:封装了前端传递过来的请求
    :param pk:当前用户想要下载的文件id
    :return:文件下载状态
    """

    """前段在发送请求的时候应该是从cookie里面拿到的id, 后端查询数据库，拿到文件名，拼接绝对路径"""
    file_name = Fileinfo.objects.get(id=pk).file_name  # 从数据库里面查询当前id的文件名
    file_path = "/home/zheng/Desktop/.demo/R_HDF/" + file_name  # guan文件位置

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
            # 当前用户下载数据的时候, 后台记录下载的数量,将用户下载量+1
            # author = "zheng"
            author = User.objects.get(username="郑兴涛")  # 这个是当前在线的用户
            author.download_files_data += 1
            author.save(update_fields=['download_files_data'])

            # 在作者的数据被下载的时候, 给试验员的浏览量+1
            uploader_name = Fileinfo.objects.get(id=pk).author  # 通过文件获取当前文件的试验员
            uploader = User.objects.get(username=uploader_name)
            uploader.views += 1
            uploader.save(update_fields=['views'])
        except:
            return HttpResponse("Sorry but Data storage error")
    except:
        return HttpResponse("Sorry but Not Found the File")
    return response

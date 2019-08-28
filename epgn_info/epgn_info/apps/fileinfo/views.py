import os
import json
import time
from urllib import parse
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
from drf_haystack.viewsets import HaystackViewSet
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
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
        return Response(data)


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


# 把用户选择的数据存到本地cookie中
# class SaveContrastView(APIView):
#     def perform_authentication(self, request):
#         pass
#
#     def post(self, request):
#         # 添加到cookie中存储
#         # print(info.getlist(["data"], default=None))   # 获取QueryDict中的值（getlist中必须是个可哈希的
#
#         info = request.data.dict()  # 拿到前端请求, 使用QueryDict中的dict()放法转换成字典类型
#         cookie_info = []
#         for num in info.values():
#             cookie_info.append(int(num))
#         contrast_cookie = request.COOKIES.get('contrast', None)
#
#         # 校验当前浏览器是否有保存cookie
#         if contrast_cookie:
#             # old_cookie_contrast = json.loads(contrast_cookie)  # 获取之前cookie里面的值 ==> list
#             old_cookie_contrast = parse.unquote(contrast_cookie).split(',')
#
#             # 拿到前端已有的cookie之后,要判断一下现在的值在不在cookie中
#             list_1 = []
#             for i in cookie_info:
#                 if str(i) not in old_cookie_contrast:
#                     list_1.append(int(i))
#             cookie_contrast = old_cookie_contrast + list_1
#
#             # 再遍历一次是为了去除 ''
#             contrast = []
#             for son in cookie_contrast:
#                 if son:
#                     contrast.append(son)
#         else:
#             contrast = cookie_info
#
#         a_n = ''
#         for n in contrast:
#             a_n += str(n) + ','
#         response = Response(info, status=201)
#         # response.delete_cookie('contrast')
#         # response.set_cookie('contrast', json.dumps(contrast), max_age=60 * 60 * 24 * 365)
#         response.set_cookie('contrast', parse.quote(a_n), max_age=60 * 60 * 24 * 365)
#         return response
#
#     def get(self, request):
#         # 点击查看的时候在这里返回cookie里面保存的数据
#         contrast_cookie = request.COOKIES.get('contrast', None)
#         # 获取cookie, 如果cookie 存在, 就拿到转码后的contrast_cookie
#         if contrast_cookie:
#             contrast = json.loads(contrast_cookie)
#         else:
#             contrast = {}
#
#         print(contrast)
#         cars = []
#         for cars_info in contrast:
#             # 拿到每个商品sku, 设置其个别属性
#             cars = Fileinfo.objects.get(id=1)
#
#         serializer = ContrasCartSerializer(cars, many=True)
#         return Response(serializer)


# 使用elasticsearch搜索引擎
class FileSearchViewSet(HaystackViewSet):
    """Fileinfo搜索"""
    index_models = [Fileinfo]
    serializer_class = FileIndexSerializer


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


# 文档查看
def word(request):
    file = open('/home/spider/Documents/Project/EPGN_INFO/epgn_front_end/word/使用说明文档.docx', 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="EPGN_INFO.docx"'
    return response


# 上传文件
# @login_required
def upload(request):
    if request.method == "GET":
        return render(request, 'upload.html')

    a = time.time()
    # 从前端获取的数据
    car_model_id = request.POST.get("car_model")  # 车型
    produce = request.POST.get("produce")  # 生产阶段
    direction_id = request.POST.get("direction")  # 方向
    part_id = request.POST.get("parts")  # 零部件
    status_id = request.POST.get("status")  # 工况
    author = request.POST.get("author")  # 用户名
    car_num = request.POST.get("car_num")  # 车号
    propulsion_id = request.POST.get("propulsion")  # 动力总成
    power_id = request.POST.get("power")  # 功率
    create_date = request.POST.get("date_hash")  # 时间
    files = request.FILES.get("file")  # 文件
    other_need = request.POST.get("other_need")
    filename = str(files)
    kv = request.POST.get('kv')
    EPG = request.POST.get('EPG')
    other = request.POST.get('other')

    # save_path = "/media/sf_E_DRIVE/FileInfo/"  # guan-文件存放地址
    # save_path = "/media/sf_E_DRIVE/EPGNINFO/"  # guan2-文件存放地址
    # save_path = "/home/spider-spider/Documents/qwe/"  # home 文件存放地址
    save_path = "/home/spider/Music/"  # work

    # 从数据库中查询vue框架绑定的id(车型, 动力总成-功率, 专业方向-零部件-工况)
    car_model = Platform.objects.get(id=car_model_id).name

    # 获取平台
    platform_id = Platform.objects.get(id=car_model_id).parent_id
    platform = Platform.objects.get(id=platform_id).name

    propulsion = PropulsionPower.objects.get(id=propulsion_id).num
    power = PropulsionPower.objects.get(id=power_id).num
    direction = Direction.objects.get(id=direction_id).name
    parts = Direction.objects.get(id=part_id).name
    status = Direction.objects.get(id=status_id).name

    # print(platform, car_model, direction, parts, status, author, car_num, propulsion, power, create_date)

    if car_model and direction and parts and status and author and car_num and propulsion and power and create_date and produce:
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
                         produce=produce).save()

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
    return HttpResponse(res_dict)

# 文件下载
# @login_required
def file_down(request, pk):
    """前段在发送请求的时候应该是从cookie里面拿到的id, 后端查询数据库，拿到文件名，拼接绝对路径"""
    file_name = Fileinfo.objects.get(id=pk).file_name  # 从数据库里面查询当前id的文件名
    # file_path = "/media/sf_E_DRIVE/FileInfo/hdf/" + file_name   # guan文件位置
    file_path = "/home/spider/Music/hdf/" + file_name
    if not os.path.isfile(file_path):
        # 判断下载文件是否存在
        return HttpResponse("Sorry but Not Found the File")

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
    except:
        return HttpResponse("Sorry but Not Found the File")
    return response


# 文件上传时候的撤销
# @login_required
def cancel(request):
    save_path = "/home/spider/Music/"
    # 接收前端传递的参数
    body = request.body
    body_str = body.decode()
    body_json = json.loads(body_str)
    file_name = body_json["filename"]

    file_id = Fileinfo.objects.get(file_name=file_name).id

    try:
        # TODO: 通过参数，找到SQL中的数据，删除（回滚）
        with transaction.atomic():
            Fileinfo.objects.filter(id=file_id).delete()
            # 通过参数，拼接出该文件的绝对路径，删除（try）
            os.remove(save_path + "hdf/" + file_name)
            result = {
                "code": 0,
                "msg": "File Revoked Successfully!",
                "data": {
                    "info": "Please Reselect File Upload!"
                }
            }
        return HttpResponse(json.dumps(result))
    except FileNotFoundError as error:
        result = {
            "code": 1,
            "msg": "File Revocation Failed!",
            "data": {
                "info": "Please Contact The Super Administrator!"
            }
        }
        return HttpResponse(json.dumps(result))


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
    data = []
    for i in items:
        if i.parent_id:
            item = {}
            item["id"] = i.id
            item["num"] = i.num
            data.append(item)
    power = data

    # 专业方向
    parts = Direction.objects.filter(parent=None)
    parts_num = DirectionSerializer(parts, many=True)
    parts = parts_num.data

    # 测试项目
    # parts_obj = Direction.objects.get(pk=pk)
    # serializer_status = PartsWorkSerializer(parts_obj)
    # status = serializer_status.data

    data = {
        "platforms": platforms,
        "cars": cars,
        "propulsions": propulsions,
        "powers": power,
        "parts": parts,
        # "status": status

    }
    return render(request, 'info.html', data)

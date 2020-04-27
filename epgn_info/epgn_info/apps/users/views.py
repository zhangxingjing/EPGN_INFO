import json
from .serializers import *
from django.views import View
from django.db import transaction
from django.shortcuts import render
from django.http import JsonResponse
from fileinfo.models import Fileinfo
from django.core import serializers
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from rest_framework import viewsets, mixins, status
from django.contrib.auth import authenticate, logout
from django.core import serializers as dc_serializers
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
from .serializers import AuthUserSerializer, UserFileSerializer
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage



# 重写 ==> admin创建的用户密码加密登录校验
class AuthUserView(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin):
    serializer_class = AuthUserSerializer
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        serializers = self.get_serializer(data=request.data)
        serializers.is_valid(raise_exception=True)
        serializers.validated_data["password"] = make_password(serializers.validated_data["password"])
        self.perform_create(serializers)
        headers = self.get_success_headers(serializers.data)
        return Response(serializers.data, status=status.HTTP_201_CREATED, headers=headers)


# 注册： url(r'^users/$', views.UserView.as_view()),
class UserView(CreateAPIView):
    serializer_class = CreateUserSerializer


# 获取用户信息： url('^user/$', views.UserDetailView.as_view()),
class UserDetailView(RetrieveAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# 获取用户数据： router.register(r'^user_name', UserInfoViewSet)
class UserInfoViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserFileSerializer

    # 改： "PATCH" /user_name/3/
    def update(self, request, *args, **kwargs):
        # 获取数据
        username = request.POST.get("username", None)
        old_password = request.POST.get("old_password", None)
        new_password = request.POST.get("new_password", None)
        re_password = request.POST.get("re_password", None)

        user = authenticate(username=username, password=old_password)  # 校验用户输入的旧密码是否正确
        if user is None:
            return JsonResponse({"info": "当前密码输入错误，请重新输入！"})
        if new_password != re_password:
            return JsonResponse({"info": "两次密码输入不同，请重新输入！"})
        if user.is_active:  # 判断当前用户是否登录
            return JsonResponse({"items": "当前用户未登录，请 登录 后修改密码！"})
        user = User.objects.get(username=username)
        with transaction.atomic():  # 数据库回滚
            try:
                user.set_password(new_password)
                user.save()
                data = {"info": "密码修改成功，请重新登录！"}
            except Exception as error:
                user = user
                data = {"info": "密码修改失败，请联系超管！"}
        return JsonResponse(data)

    # 查： "GET" /user_name/3/
    def list(self, request, *args, **kwargs):
        # 如果返回的是当前用户名，就可以直接根据用户名获取数据
        job_number = request.GET.get("job_number")
        user = User.objects.get(job_number=job_number)
        file_info = Fileinfo.objects.filter(author=user.username)  # 获取当前用户名的数据
        items = json.loads(dc_serializers.serialize("json", file_info))  # 序列化
        return JsonResponse({"items": items})


# 退出登录
class LogoutView(View):
    '''退出登录'''

    def get(self, request):
        '''退出登录'''
        # 清楚用户的session信息
        logout(request)

        # 跳转到首页
        return render(request, 'login.html')


# home页面
def home(request):
    if request.method == "GET":
        return render(request, 'home.html')
    user_id = request.POST.get("user_id")  # 当前端直接使用参数请求的时候
    # text = request.body.decode()  # 当前端使用序列化之后的参数请求时
    # body_json = json.loads(text)
    # user_id = body_json["user_id"]
    user = User.objects.get(id=user_id)
    user_views = user.views
    user_download_files_data = user.download_files_data
    user_update_files_data = user.update_files_data
    user_task = user.task.count()
    user_task_info = user.task.all()  # 用户的待办事项
    file_point = []
    file_classify = Fileinfo.objects.values("carmodel").annotate(Count("carmodel")).order_by()
    for file_count in file_classify:
        # print(file_count["carmodel__count"], file_count["carmodel"])  # 获取当前用户数据中不同的车型
        file_point.append(file_count)
    # print(user_task, [task_info.name for task_info in user_task_info])
    file_info = Fileinfo.objects.filter(author=user.username)  # 获取当前用户名的数据
    items = json.loads(dc_serializers.serialize("json", file_info))  # 序列化
    user_data = {
        "views": user_views,
        "user_download": user_download_files_data,
        "user_update": user_update_files_data,
        "user_items": items,
        "user_task": user_task,
        "user_task_info": [task_info.name for task_info in user_task_info],
    }
    return JsonResponse(user_data)


# 渲染用户个人数据
def user_file(request, pk):
    # 前端传递筛选的额数据, 这里返回符合当前条件的数据 ==> 前端发送请求时候就是这个格式

    # 这里是分页查询的page和limit
    # user_id = request.GET.get("user_id", None)
    page = request.GET.get('page', "1")
    limit = int(request.GET.get('limit', "20"))
    user = User.objects.get(id=pk)
    search_dict = {}
    search_dict["author"] = user.username
    items = Fileinfo.objects.filter(**search_dict).order_by('-id')
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


# 用户信息
def user_info(request, pk):
    if request.method == "GET":
        return render(request, 'userinfo.html')

    user = User.objects.get(id=pk)
    username = request.POST.get("username", None)
    old_password = request.POST.get("old_password", None)
    new_password = request.POST.get("new_password", None)
    re_password = request.POST.get("re_password", None)

    print(username, old_password, new_password, re_password)

    user = authenticate(username=username, password=old_password)  # 校验用户输入的旧密码是否正确
    if user is None:
        return JsonResponse({"info": "当前密码输入错误，请重新输入！"})
    if new_password is None or re_password is None or new_password != re_password:
        return JsonResponse({"info": "新密码输入错误，请重新输入！"})
    if user.is_active is False:  # 判断当前用户是否登录
        return JsonResponse({"items": "当前用户未登录，请 登录 后修改密码！"})
    user = User.objects.get(username=username)
    with transaction.atomic():  # 数据库回滚
        try:
            user.set_password(new_password)
            user.save()
            data = {"info": "密码修改成功，请重新登录！"}
            return JsonResponse({"code": 1, "msg": data})
        except Exception as error:
            user = user
            data = {"info": "密码修改失败，请联系超管！"}
            return JsonResponse({"code": 0, "msg": data})

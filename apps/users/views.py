import os
import json
from .serializers import *
from django.views import View
from django.db import transaction
from django.db.models import Count
from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse
from fileinfo.models import Fileinfo
from django.contrib.auth import logout
from rest_framework.response import Response
from rest_framework import viewsets, mixins, status
from django.core import serializers as dc_serializers
from django.contrib.auth.hashers import make_password
from settings.dev import FILE_HEAD_PATH, FILE_READ_PATH
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage


class AuthUserView(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        serializers = self.get_serializer(data=request.data)
        serializers.is_valid(raise_exception=True)
        serializers.validated_data["password"] = make_password(serializers.validated_data["password"])
        self.perform_create(serializers)
        headers = self.get_success_headers(serializers.data)
        return Response(serializers.data, status=status.HTTP_201_CREATED, headers=headers)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        return render(request, 'user/userinfo.html')

    def update(self, request, *args, **kwargs):
        print("通过UPDATE")
        # partial = kwargs.pop('partial', False)
        # instance = self.get_object()
        # serializer = self.get_serializer(instance, data=request.data, partial=partial)
        # serializer.is_valid(raise_exception=True)
        # self.perform_update(serializer)
        #
        # if getattr(instance, '_prefetched_objects_cache', None):
        #     instance._prefetched_objects_cache = {}

        return Response(serializer.data)

class UserFileViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-id')
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        """查询用户数据"""
        # instance = self.get_object()
        # items = Fileinfo.objects.filter(author=instance)
        # items = json.loads(dc_serializers.serialize("json", items))  # 序列化
        # return Response(data=items)
        page = request.GET.get('page', "1")
        limit = int(request.GET.get('limit', "20"))

        user = User.objects.get(username=self.get_object())
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

    def destroy(self, request, *args, **kwargs):
        """删除用户数据"""
        instance = self.get_object()  # username
        file_list = json.loads(request.body.decode())["file_list"]
        for file_id in file_list:
            file = Fileinfo.objects.get(id=file_id)
            with transaction.atomic():
                try:
                    file.delete()
                    head_file_path = os.path.join(FILE_HEAD_PATH, file.file_name)
                    if os.path.isfile(head_file_path):
                        os.remove(head_file_path)
                    read_file_path = os.path.join(FILE_READ_PATH, file.file_name)
                    if os.path.isfile(read_file_path):
                        os.remove(read_file_path)
                except:
                    return Response(data="删除失败")
        items = Fileinfo.objects.filter(author=instance)
        items = json.loads(dc_serializers.serialize("json", items))
        return Response(data=items, )


class LogoutView(View):
    def get(self, request):
        logout(request)
        return render(request, 'user/login.html')


def home(request):
    if request.method == "GET":
        return render(request, 'user/home.html')
    user_id = request.POST.get("user_id")  # 当前端直接使用参数请求的时候
    user = User.objects.get(id=user_id)
    user_views = user.views
    user_download_files_data = user.download_files_data
    user_update_files_data = user.update_files_data
    user_task = user.task.count()
    user_task_info = user.task.all()  # 用户的待办事项
    file_point = []
    file_classify = Fileinfo.objects.values("carmodel").annotate(Count("carmodel")).order_by()

    for file_count in file_classify:
        file_point.append(file_count)

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

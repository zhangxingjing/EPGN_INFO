import json

from .models import User
from . import serializers
from django.contrib import auth
from django.db import transaction
from django.http import HttpResponse
from .serializers import AuthUserSerializer
from rest_framework.response import Response
from rest_framework import viewsets, mixins, status
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render, redirect, get_object_or_404
from rest_framework.generics import CreateAPIView, RetrieveAPIView


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
    serializer_class = serializers.CreateUserSerializer


# 获取用户信息： url('^user/$', views.UserDetailView.as_view()),
class UserDetailView(RetrieveAPIView):
    serializer_class = serializers.UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# 修改密码：url('^userinfo/$', views.user_info),
def user_info(request):
    if request.method == "GET":
        return render(request, 'userinfo.html')

    # 获取数据
    username = request.POST.get("username", None)
    old_password = request.POST.get("old_password", None)
    new_password = request.POST.get("new_password", None)
    re_password = request.POST.get("re_password", None)
    print(username, old_password, new_password, re_password)

    user = authenticate(username=username, password=old_password)
    if user is not None:    # 判断old_password
        if new_password == re_password:    # 判断两次密码
            if user.is_active:  # 判断用户权限
                user = User.objects.get(username=username)
                data = {}
                with transaction.atomic():  # 数据库回滚
                    try:
                        user.set_password(new_password)
                        user.save()
                        data = {"msg":"密码修改成功，请重新登录！"}
                    except Exception as error:
                        user = user
                        data = {"msg": "密码修改失败，请联系超管！"}
                return HttpResponse(data)
            return HttpResponse({"msg":"您没有权限修改当前用户信息！"})
        return HttpResponse({"msg":"两次密码不一致，请重新填写！"})
    return HttpResponse(json.dumps({"msg":"旧密码错误，请重新填写！"}))

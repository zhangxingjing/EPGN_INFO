from . import serializers
from django.contrib import auth
from django.http import HttpResponse
from django.shortcuts import render, redirect
from rest_framework.generics import CreateAPIView
from django.contrib.auth import authenticate, login


# url(r'^users/$', views.UserView.as_view()),
# class UserView(CreateAPIView):
#     serializer_class = serializers.CreateUserSerializer

# 登录
def user_login(request):
    """用户使用工号，密码登录 ==> 用户登录之后页面跳转到首页 ==> 所有的API需要校验用户登录状态"""
    if request.method == 'GET':
        # return render(request, 'login.html')
        # 咋个发起POST请求呀
        username = request.GET.get('username', None)
        password = request.GET.get('password', None)
        print(username, password)
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return redirect('/base/100')
        else:
            return HttpResponse("用户名或者密码错误")
    else:
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)
        user = authenticate(username=username, password=password)
        if user:
            # 用户登录
            login(request, user)
            # 登录成功返回页面
            return redirect('/base/100')
        else:
            return HttpResponse("用户名或者密码错误")


# 退出
def logout(request):
    auth.logout(request)
    return render(request, 'login.html')

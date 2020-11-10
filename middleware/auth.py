# !/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2020/8/13 上午1:41
# @Author  : Zheng Xingtao
# @File    : auth.py


from datetime import datetime

from django.shortcuts import redirect
from django.utils.deprecation import MiddlewareMixin

from settings.dev import WHITE_REGEX_URL_LIST
from users.models import User


class Author(object):
    """
    在中间件中封装tracer对象
    """

    def __init__(self):
        self.user = None


class AuthMiddleware(MiddlewareMixin):
    """
    用户校验的中间件
    1. process_request
    2. process_view
    """

    @staticmethod  # 在视图之前执行
    def process_request(request):

        print("process_request_______")
        # 实例化一个Author()对象
        request.author = Author()

        # 如果用户登录了, 在request中赋值
        user_id = request.session.get("user_id", 0)
        user_obj = User.objects.filter(id=user_id).first()

        request.author.user = user_obj

        # 白名单：用户没有登录都可以访问的页面
        """
        1. 获取当前访问的url
        2. 判断url是否在白名单中
            2.1 在--继续向后访问
            2.2 不在--判断时候已登录
                2.2.1 已登录--继续向后访问
                2.2.2 未登录--返回登录页面
        """

        if request.path_info in WHITE_REGEX_URL_LIST:
            return

        if not request.author.user:  # 这时候检验不通过，跳转到登录（用url跳转）
            return redirect('/')

    @staticmethod  # 基于请求响应
    def process_response(request, response):
        print("md1  process_response 方法！", id(request))  # 在视图之后
        return response

    @staticmethod  # 在视图之前执行 顺序执行
    def process_view(request, view, args, kwargs):
        """
        :param request:
        :param view:
        :param args:
        :param kwargs:
        :return: 通过了就直接return，不通过就用redirect做跳转
        """
        print("md1  process_view 方法！")
        return
        # return redirect('/')

    @staticmethod  # 引发错误 才会触发这个方法
    def process_exception(request, exception):
        print("md1  process_exception 方法！")
        # return HttpResponse(exception) #返回错误信息

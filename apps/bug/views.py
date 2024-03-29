import json
import time

from django.http import JsonResponse

from users.models import User
from django.shortcuts import render
from rest_framework import viewsets
from django.core import serializers
from .models import Category, Bug  # , Developer
from rest_framework.response import Response
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from .serializers import CategorySerializer, BugSerializer  # , DeveloperSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# class DeveloperViewSet(viewsets.ModelViewSet):
#     queryset = Developer.objects.all()
#     serializer_class = DeveloperSerializer


class BugViewSet(viewsets.ModelViewSet):
    queryset = Bug.objects.all()
    serializer_class = BugSerializer

    def create(self, request, *args, **kwargs):
        author = User.objects.get(id=int(request.data['author']))
        category = Category.objects.get(id=int(request.data['category']))

        Bug.objects.create(
            author=author,
            level=request.data['level'],
            category=category,
            status=request.data['status'],
            content=request.data['content'],
            # developer=request.data['developer'],
            create_time=time.strftime('%Y-%m-%d', time.localtime(time.time()))
        ).save()
        return JsonResponse({"status": True})

    def list(self, request, *args, **kwargs):
        page = request.GET.get('page', "1")
        limit = int(request.GET.get('limit', "20"))
        items = Bug.objects.all()
        paginator = Paginator(items, limit)

        try:
            page_item = paginator.page(page)
        except PageNotAnInteger:
            page_item = paginator.page(1)
        except EmptyPage:
            page_item = paginator.page(paginator.num_pages)
        items = json.loads(serializers.serialize("json", page_item))

        # res_list = BugSerializer(items, many=True).data # 这里应该使用many序列化的
        res_list = []
        for item in items:
            bug_obj = Bug.objects.get(id=item["pk"])
            item_serializer = BugSerializer(bug_obj).data
            res_list.append(item_serializer)

        # item["fields"].update(pk=item["pk"])  # 把id添加到列表中,只返回数据字典
        # item["fields"]["author"] = User.objects.get(id=item["fields"]["author"]).username
        # item["fields"]["category"] = Category.objects.get(id=item["fields"]["category"]).name
        # item["fields"]["developer"] = Developer.objects.get(id=item["fields"]["developer"]).name
        # item["fields"]["developer"] = item
        # print(item)
        # res_list.append(item["fields"])
        res = {
            "code": 0,
            "msg": "OK",
            "count": paginator.count,  # 数据的条数
            "data": res_list  # 返回的数据列表
        }
        return Response(data=res)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        return render(request, 'bug/bug_detail.html', {"data": instance})


def page(request):
    return render(request, 'bug/bug_info.html')


def create(request):
    return render(request, "bug/bug_create.html")


def detail(request):
    return render(request, "bug/bug_detail.html")

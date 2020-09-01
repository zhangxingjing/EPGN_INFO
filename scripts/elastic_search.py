# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author : Zheng Xingtao
# File : elastic_search
# Datetime : 2020/8/18 下午2:39


from django.http import JsonResponse
from drf_haystack.viewsets import HaystackViewSet
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage


class ElasticSearchReturn(HaystackViewSet):
    """封装elasticsearch查询结果"""

    def get_queryset(self, index_models=[]):
        if self.queryset is not None and isinstance(self.queryset, self.object_class):
            queryset = self.queryset.all()
        else:
            queryset = self.object_class()._clone()
            if len(index_models):
                queryset = queryset.models(*index_models)
            elif len(self.index_models):
                queryset = queryset.models(*self.index_models)
        return queryset

    def list(self, request, *args, **kwargs):
        """重写list查询方法，封装数据格式，使用Django自带的分页器"""
        limit = int(request.GET.get('limit', "20"))
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)

        paginator = Paginator(serializer.data, limit)
        try:
            page_item = paginator.page(page)
        except PageNotAnInteger:
            page_item = paginator.page(1)
        except EmptyPage:
            page_item = paginator.page(paginator.num_pages)

        return JsonResponse({
            "code": 0,
            "msg": "OK",
            "count": len(queryset),
            "data": [item for item in page_item]
        })

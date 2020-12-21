# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author : Zheng Xingtao
# File : search_indexes.py
# Datetime : 2020/8/12 下午12:57


from haystack import indexes
from haystack.forms import SearchForm

from .models import Fileinfo


class FileinfoIndex(indexes.SearchIndex, indexes.Indexable):
    # class FileinfoIndex(SearchForm):
    """
    索引数据模型类
    """
    text = indexes.CharField(document=True, use_template=True)

    id = indexes.IntegerField(model_attr="id")
    platform = indexes.CharField(model_attr="platform")
    carmodel = indexes.CharField(model_attr="carmodel")
    produce = indexes.CharField(model_attr="produce")
    direction = indexes.CharField(model_attr="direction")
    parts = indexes.CharField(model_attr="parts")
    status = indexes.CharField(model_attr="status")
    author = indexes.CharField(model_attr="author")
    car_num = indexes.CharField(model_attr="car_num")
    propulsion = indexes.CharField(model_attr="propulsion")

    power = indexes.CharField(model_attr="power")
    create_date = indexes.CharField(model_attr="create_date")
    file_name = indexes.CharField(model_attr="file_name")
    file_type = indexes.CharField(model_attr="file_type")
    other_need = indexes.CharField(model_attr="other_need")
    gearbox = indexes.CharField(model_attr="gearbox")
    file_status = indexes.CharField(model_attr="file_status")

    def get_model(self):
        """返回建立索引的模型类"""
        return Fileinfo

    def index_queryset(self, using=None):
        """返回要建立索引的数据查询集"""
        return self.get_model().objects.all()

    # def search(self):
    #     sqs = super(FileinfoIndex, self).search().models(*self.get_models())
    #     return sqs
    #
    # def no_query_found(self):
    #     return self.searchqueryset.all()

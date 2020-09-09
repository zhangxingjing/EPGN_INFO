# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author : Zheng Xingtao
# File : search_indexes.py
# Datetime : 2020/8/12 下午12:57


from .models import Audio
from haystack import indexes


class AudioIndex(indexes.SearchIndex, indexes.Indexable):
    """
    索引数据模型类
    """
    text = indexes.CharField(document=True, use_template=True)

    id = indexes.IntegerField(model_attr="id")
    status = indexes.CharField(model_attr="status")
    frequency = indexes.CharField(model_attr="frequency")
    details = indexes.CharField(model_attr="details")
    detail_from = indexes.CharField(model_attr="detail_from")
    # complaint_feature = indexes.CharField(model_attr="complaint_feature")
    order = indexes.CharField(model_attr="order")
    reason = indexes.CharField(model_attr="reason")
    measures = indexes.CharField(model_attr="measures")
    car_model = indexes.CharField(model_attr="car_model")
    propulsion = indexes.CharField(model_attr="propulsion")
    gearbox = indexes.CharField(model_attr="gearbox")
    power = indexes.CharField(model_attr="power")
    tire_model = indexes.CharField(model_attr="tire_model")
    author = indexes.CharField(model_attr="author")
    hdf = indexes.CharField(model_attr="hdf", default=None)
    img = indexes.CharField(model_attr="img", default=None)
    mp3 = indexes.CharField(model_attr="mp3", default=None)
    ppt = indexes.CharField(model_attr="ppt", default=None)
    description_name = indexes.CharField(model_attr="description_name")

    def get_model(self):
        """返回建立索引的模型类"""
        return Audio

    def index_queryset(self, using=None):
        """返回要建立索引的数据查询集"""
        return self.get_model().objects.all()

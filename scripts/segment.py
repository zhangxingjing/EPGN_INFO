# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author    : Zheng Xingtao
# File      : segment
# Datetime  : 2020/7/23 下午4:40

import bisect


def find_closest_index(a, x):
    """
    在列表中获取最接近指定值的数据
    :param a: 包含所有数据的列表
    :param x: 指定的数值
    :return: 最接近的值
    """
    i = bisect.bisect_left(a, x)
    if i >= len(a):
        i = len(a) - 1
    elif i and a[i] - x > x - a[i - 1]:
        i = i - 1
    return a[i]


def parse(x_list, step):
    """
    获取列表中指定的分段点
    :param x_list: 列表
    :param step: 步长
    :return: 正确的分段点
    """
    items = []
    result = find_closest_index(x_list, step)
    for i in range(len(x_list)):
        if result != x_list[-1]:
            if i == 0:
                result = x_list[0]
            result = find_closest_index(x_list, result + step)
            # yield result
            items.append(result)
    return items
# x_list = list(map(lambda k: k[0], a))
# for i in parse(x_list, 1000):
#     print(i)

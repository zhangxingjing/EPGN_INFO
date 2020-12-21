# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author : Zheng Xingtao
# File : judge_frequency.py
# Datetime : 2020/8/20 下午4:29
import re


def judge(frequency, key: str):
    """
    1. 获取一个frequency对象, 判断key所在的范围, 返回这个范围的id
    2. 直接用key进行范围判断(选用)
    """
    frequency_id_list = []
    key_number = re.findall(r'\d+', key)

    if len(key_number) == 1:
        number = int(key_number[0])
        # key 为值的时候
        if 0 <= number <= 50:
            frequency_id_list.append(1)

        elif 50 <= number <= 100:
            frequency_id_list.append(2)

        elif 100 <= number <= 500:
            frequency_id_list.append(3)

        elif 500 <= number <= 1000:
            frequency_id_list.append(4)

        elif 1000 <= number <= 3000:
            frequency_id_list.append(5)

        elif 3000 <= number <= 20000:
            frequency_id_list.append(6)

    else:
        # key 为一个范围
        all_list = [
            [0, 50],
            [50, 100],
            [100, 500],
            [500, 1000],
            [1000, 3000],
            [3000, 20000]
        ]
        for interval in all_list:
            number_1 = int(key_number[0])
            number_2 = int(key_number[1])
            result_index = relation(interval, [number_1, number_2])
            if result_index != 1:
                id_index = all_list.index(interval) + 1
                frequency_id_list.append(id_index)

    return frequency_id_list


def relation(interval1, interval2):
    """
    判断两个区间的关系
    :param interval1: 第一个区间
    :param interval2: 第二个区间
    :return: 返回两个区间的关系
        0: 两个区间相等
        1: 两个区间相离
        2: 两个区间相交
        3: 两个区间为包含关系
    """

    min1, max1 = sorted(interval1)
    min2, max2 = sorted(interval2)
    if (min1 == min2 and max1 == max2):
        return 0  # 0，相等

    if (max1 < min2 or max2 < min1):
        return 1  # 1，相离

    if (min1 < min2 <= max1 < max2 or min2 < min1 <= max2 < max1):
        return 2  # 2，相交

    if (min1 <= min2 <= max2 <= max1 or min2 <= min1 <= max1 <= max2):
        return 3  # 3，包含

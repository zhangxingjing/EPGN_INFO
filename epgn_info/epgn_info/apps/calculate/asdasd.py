# !/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2020/4/14 下午4:56
# @Author  : Zheng Xingtao
# @File    : asdasd.py


items = [1, 2, 3, 4, 5, 6]
new_items = []
step = 2


# for i in range(0, 10, 2):
#     print(i)

def segment(items, step):
    """
    分段取峰值
    :param step: 对数据进行分段时候的步长
    :return: 分段之后获取的峰值列表
    """
    for i in range(len(items)):
        q = []
        qwe = step - (len(items) - i)
        if qwe <= 0:
            q = items[i:i + step]
        else:
            print("应该添加:", len(items) - i)
            q.append(items[0 - len(items) - i:])
            for u in range(qwe):
                q.append(0)
        list_max = max(q)
        print(list_max)
        # new_items.append(list_max)
        # print("new_items:", new_items)


def segment_for(items, step, new_items):
    if len(items) > step:
        # new_items.append(max(items[:3]))
        new_items.append(max(items, key=lambda x: x[1]))
        segment_for(items[step:], step, new_items)
    else:
        # new_items.append(max(items))
        new_items.append(max(items, key=lambda x: x[1]))
    return new_items


# a = [i for i in range(10)]
# print(segment_for(a, 3, []))
# a = [('s', 0,), ('s', 706), ('e', 14), ('s', 14), ('e', 7), ('s', 6)]
# print(segment_for(a, 2, []))

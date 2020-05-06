def segment_for(items, step, new_items):
    """
    分段取峰值
    :param items: 一个装有元组的列表
    :param step: 分段的步长
    :param new_items: 递归时候的参数[]
    :return: 分段取峰值之后的列表
    """
    if len(items) > step:
        # new_items.append(max(items[:3]))
        new_items.append(max(items, key=lambda x: x[1]))
        segment_for(items[step:], step, new_items)
    else:
        # new_items.append(max(items))
        new_items.append(max(items, key=lambda x: x[1]))
    return new_items


a = [['s', 0, ], ['s', 706], ['e', 14], ['s', 16], ['e', 7], ['s', 6]]
print(segment_for(a, 3, []))

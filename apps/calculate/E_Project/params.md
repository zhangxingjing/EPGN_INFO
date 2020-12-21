> 这里需要使用E架构需要的参数格式

# 请求参数示例
```json
{
    "fileChannels":
        [
            {
                "ckChannelInfos": "Time",
                "fileId": "File_783453990934286336.h5",
                "stdChannelInfos": [
                    "VL",
                    "VR"
                ]
            }
        ],
    "algorithmParams":
        [
            {"arg1": "1"},
            {"arg2": "2"},
            {"arg3": "3"}
        ],
    "imageType": "1"
}
```

# 请求参数说明：
```text
算法参数: algorithmParams

文件管道: fileChannels

图片类型：imageType

参考通道信息: ckChannelInfos

标准通道信息: stdChannelInfos
```


# 返回数据说明

## 折线图
```json
{
    "code": 1,
    "data": [
        {
            "filename": "F3 VZ run09.hdf",
            "channel": "VR",
            "fileId": "101",
            "x": [1, 2],
            "y": [2, 5],
            "status": "Xxx"
        }
    ]
}
```


## 热力图
```json
    {
        "code": 1,
        "data": [
            {
                "filename": "F3 VZ run09.hdf",
                "channel": "VR",
                "x": [1, 2],
                "y": [1, 2, 3],
                "z": [
                    [30, 40],
                    [50, 30],
                    [40, 70]
                ],  // 一个数组代表一行数据
                "status": "Xxx"
            }
        ]
    }
```

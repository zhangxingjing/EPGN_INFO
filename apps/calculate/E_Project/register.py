# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author : Zheng Xingtao
# File : E_calculate_2
# Datetime : 2020/8/19 下午1:43


from calculate.E_Project.config import *


def my_fft(map_data):
    result_list = []
    for file_name, fileId, status, channel, params_dict, channel_data, raw_time_num, raw_data_num, raw_rpm_num in \
            MapResult(map_data).data_for_calculate():
        overlap = int(params_dict["overlap"])
        weighting = int(params_dict["weighting"])

        result = FftCalculate(
            channel_data, raw_time_num, raw_data_num, raw_rpm_num,
            overlap=overlap, weighting=weighting
        ).fft_average()

        result_list.append({
            "filename": file_name,
            "fileId": fileId,
            "status": status,
            "channel": channel,
            "x": list(result[0]),
            "y": list(result[1])
        })
    return result_list


def fft_rpm(map_data):
    result_ = {
        "code": 1,
        "data": [{
            "filename": "F3 VZ run09.hdf",
            "channel": "VR",
            "x": [1, 2],
            "y": [1, 2, 3],
            "z": [[30, 40], [50, 30], [40, 70]],  # 一个数组代表一行数据
            "status": "Xxx"
        }]

    }
    for params_dict, channel_data, raw_time_num, raw_data_num, raw_rpm_num \
            in MapResult(map_data).data_for_calculate():
        rpm_step = params_dict["rpm_step"]
        rpmtype = params_dict["rpmtype"]
        spectrum_size = params_dict["spectrum_size"]
        weighting = params_dict["weighting"]

        result = FFT_RPM(
            channel_data, raw_time_num, raw_data_num, raw_rpm_num,
            rpm_step=rpm_step, rpmtype=rpmtype, spectrum_size=spectrum_size, weighting=weighting
        ).fft_rpm()
        yield result


def level_rpm(map_data):
    for params_dict, channel_data, raw_time_num, raw_data_num, raw_rpm_num in MapResult(map_data).data_for_calculate():
        # 在这里填写当前需要的参数，map中发送的参数都可以在这里获取到
        timeWeighting = params_dict["timeWeighting"]
        result = LevelVsRpm(
            channel_data, raw_time_num, raw_data_num, raw_rpm_num,
            timeWeighting=timeWeighting
        ).run()
        yield result


if __name__ == '__main__':
    map_data = {
        "imageCount": "1",
        "fileChannels": [
            {
                "ckChannelInfos": "data_EngineRPM",
                "fileId": "2020-07-21_F3 VZ run09.hdf",
                "stdChannelInfos": [
                    "data_VL",
                    "data_VR"
                ]
            },
            {
                "ckChannelInfos": "data_EngineRPM",
                "fileId": "2020-07-21_F3 VZ run09.hdf",
                "stdChannelInfos": [
                    "data_VL",
                    "data_VR"
                ]
            }
        ],
        "algorithmName": "FftCalculate",
        "algorithmParams": [
            {"A": "1"},
            {"order": "2"},
            {"overlap": "75"},
            {"weighting": "1"},
            {"rpm_step": "10"},
            {"smoothFrac": "0.1"},
            {"orderWidth": "0.5"},
            {"rpmtype": "rasing"},
            {"timeWeighting": "0.125"},
            {"spectrum_size": "123"}
        ],
        "imageType": "1"
    }
    # data = my_fft(map_data)
    # pprint(data)


def register():
    from dubbo.server import DubboService

    service = DubboService(20880, 'EPGN')

    # parse_fft 二维数据
    service.add_method('EPGN', 'parse_fft', my_fft)

    # level_rpm 二维数据
    service.add_method('EPGN', 'level_rpm', level_rpm)

    # fft_rpm   三维数据
    service.add_method('EPGN', 'fft_rpm', fft_rpm)
    service.register('10.160.244.22:2182')
    service.start()

# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author    : Zheng Xingtao
# File      : class_name.py
# Datetime  : 2020/5/19 下午3:54


CalculateNameDict = {
    # 自动报告-工况信息
    "(N)G3 VZ": "LevelVsTime",
    "(N)G3 VS": "OrderVsVfft",
    "(N)G5 VZ": "OrderVsVfft",
    "(Square&Lab)Leerlauf D Gang mit AC": "LevelVsTime",
    "(Square&Lab)Leerlauf P Gang mit AC": "LevelVsTime",
    "(Square&Lab)Leerlauf R Gang mit AC": "LevelVsTime",
    "(Square&Lab)Leerlauf N Gang mit AC": "LevelVsTime",
    "(Square&Lab)Leerlauf D Gang ohne Verbrauche": "LevelVsTime",
    "(Square&Lab)Leerlauf P Gang ohne Verbrauche": "LevelVsTime",
    "(Square&Lab)Leerlauf R Gang ohne Verbrauche": "LevelVsTime",
    "(Square&Lab)Leerlauf N Gang ohne Verbrauche": "LevelVsTime",
    "(Square&Lab)Leerlauf D Gang mit Verbrauche": "LevelVsTime",
    "(Square&Lab)Leerlauf P Gang mit Verbrauche": "LevelVsTime",
    "(Square&Lab)Leerlauf R Gang mit Verbrauche": "LevelVsTime",
    "(Square&Lab)Leerlauf N Gang mit Verbrauche": "LevelVsTime",
    "(Square&Lab)St-Sp": "StartStop",

    # 手动报告-前端参数
    "FFT": "FftCalculate",
    "Start Stop": "StartStop",  # 启停算法
    "Level vs rpm": "LevelVsRpm",
    "Level vs time": "LevelVsTime",
    "2nd Order vs rpm": "OrderVsVfft",  # TODO: 无法计算
    "Octave": "OctaveFft",  # 暂时不用管
}

CalculateNameList = ['write_result', 'fft_average', 'octave_fft', ]

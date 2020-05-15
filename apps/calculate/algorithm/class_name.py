"""
前端对应的算法名称
"""

# CalculateNameDict = {
#     # the front end page： Corresponding class name
#     "FFT": "FftCalculate",
#     "Start Stop": "StartStop",  # 启停算法
#     "Level VS RPM": "LevelVsRpm",
#     "Level VS Time": "LevelVsTime",
#     "2nd Order VS RPM": "OrderVsVfft",
#     # "FFT对时间": "FftVsTime",    # 这两个目前没法返回数据，可以返回图片
#     # "FFT对转速": "FftVsRpm",
#     # "倍频程": "OctaveFft",   # 暂时不用管
# }


CalculateNameDict = {
    # "(N)G3 VZ": "Level VS RPM",
    # "(N)G3 VZ": "2nd Order VS RPM",
    "(N)G3 VZ": "LevelVsTime",
    # "(N)G3 VS": "Level VS RPM",
    "(N)G3 VS": "OrderVsVfft",
    "(N)G5 VZ": "OrderVsVfft",
    "KP 80-20": "FftCalculate",
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
    "(Square&Lab)St-Sp": "StartStop"
}

# 发送给前端的算法名称
CalculateNameList = ['write_result', 'fft_average', 'octave_fft', ]

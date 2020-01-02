import sys
import clr
import win32ui
import numpy as np
import matplotlib.pyplot as plt

# add  .NetAssembly 这两个文件安装之后就会存在，先安装软件
sys.path.append("C:\\Program Files\\HEAD System Integration and Extension (ASX)")
clr.AddReference('HEADacoustics.API.Hdf')

# 　从hdf文件中导入所有信息
from HEADacoustics.API.Hdf import *

# Licensing ASX 加载license
license = License.Create()

# 这段代码是获取当前文件的
# dlg = win32ui.CreateFileDialog(1)
# dlg.DoModal()
# file_path = dlg.GetPathName()  # 在这里手写路径
file_path = ""

# read time data 读取时间数据（StreamReader应该是hdf文件中自带的包，可以读取当前文件中的数据）
reader = StreamReader.Create(file_path)

# get the info of the data 获取数据信息
chs = reader.GetChannels()
n = chs.Length


# get n-th channel's data
def get_nth_channel(channel_number):
    cb = channel_number
    n_frames = chs[cb].NumberOfSamples  # 获取样本数量
    data_single = chs[cb].GetData(0, n_frames)
    # init data
    data_ = []
    # get data
    for i in range(0, n_frames, 1):  # 遍历所有样本，以 1 为步长
        data_.append(data_single[i])
    data_ = np.float64(data_)  # 把数据 经float转换类型后，存放到data_中
    # get time abscissa
    time_abscissa = chs[0].EquidistantAbscissa  #
    time_ = np.arange(
        time_abscissa.FirstValue,
        time_abscissa.LastValue + time_abscissa.DeltaValue,
        time_abscissa.DeltaValue
    )
    return time_, data_


# get all channels data and plot(original and Magnitude（FFT）) one by one
# 一张一张地获取所有通道数据并绘制（原始和幅度（FFT））

# init time abscissa and data
# 初始化时间横坐标和数据
time = []
data = []
plt.figure(figsize=(10, 10))

for j in range(0, n, 1):  # 这个 n 是数据本身 还是每一列每一列的数据
    time_j, data_j = get_nth_channel(j)  # 从上面的函数中拿到数据
    fs_j = chs[j].SampleRate

    # 把从文件中读取的数据添加到 时间横坐标和数据中
    time.append(time_j)
    data.append(data_j)

    # 下面的都是画图的部分
    plt.subplot(n, 2, 2 * j + 1)
    plt.plot(time_j, data_j)
    plt.subplot(n, 2, 2 * j + 2)
    plt.magnitude_spectrum(data_j, Fs=fs_j)
plt.show()  # 显示图片

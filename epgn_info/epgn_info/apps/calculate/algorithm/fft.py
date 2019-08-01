import re
import numpy as np
from numpy.dual import fft
from scipy.fftpack.basic import fft
from matplotlib import pyplot as plt
from scipy.signal.windows import hann


def parse_data(content, img_name, raw_data):
    fs = 44100  # Sampling frequency
    spectrum_size = 8192  # 谱线数
    window_data = len(raw_data) // (spectrum_size // 2)  # 计算数据块数量
    print(window_data)
    pp = np.zeros((window_data, spectrum_size // 2 + 1))  # 预分配 fft_vs_time 矩阵
    f = ''
    for i in range(window_data):
        x = raw_data[int(i * spectrum_size / 2):int(i * spectrum_size / 2 + spectrum_size)]  # 获得分块数据'=
        n = spectrum_size  # Length for FFT
        wn = hann(n)  # 汉宁窗
        xx = x * wn  # 分块数据加窗
        y = fft(xx)
        f = fs * np.arange(n // 2 + 1) / n  # 频域取FFT结果的前一半
        p = np.abs(y / n)  # FFT结果取模值
        p1 = p[:n // 2 + 1]  # FFT结果取前半部分
        p1[1: -1] *= 2  # FFT后半部分幅值叠加到前半部分
        p2 = 2 * p1  # 恢复窗函数幅值
        p2 = p2 * 2 ** -0.5  # peak to rms
        pp[i, 0:] = p2  # 生成所有分块数据的FFT矩阵
    pp_avr = rms(pp.transpose())  # 对分块数据求均方根
    db = 20 * np.log10(pp_avr / 2.0e-5)  # 将幅值转为声压级
    A = filterA(f, content, img_name)

    sampleNumUnderTen = int(np.ceil(10 / (fs / spectrum_size)))
    dbA = db
    dbA[:sampleNumUnderTen] = db[:sampleNumUnderTen] - 70.4
    dbA[sampleNumUnderTen:] += 10 * np.log10(A[sampleNumUnderTen:])

    plt.semilogx(f, dbA)
    plt.xlim(10, 20000)
    plt.ylim(-20, 70)
    plt.xlabel('fs/Hz')
    plt.ylabel('dB(A)')
    plt.grid(b=bool, which='both')

    img_path = "./image/{}.png".format(img_name)
    plt.savefig(img_path)

    return img_path


def rms(sig, window_size=None):
    """
    计算均方根值，判断，调用
    """
    npa = np.array
    fun = lambda a, size: np.sqrt(np.sum([a[size - i - 1:len(a) - i] ** 2 for i in range(size - 1)]) / size)
    if len(sig.shape) == 2:
        return npa([rms(each, window_size) for each in sig])
    else:
        if not window_size:
            window_size = len(sig)
        return fun(sig, window_size)


def filterA(f, content, img_name, plotFilter=None):
    """
    设置对数坐标图和线性坐标图，并计算A值
    """
    c1 = 3.5041384e16
    c2 = 20.598997 ** 2
    c3 = 107.65265 ** 2
    c4 = 737.86223 ** 2
    c5 = 12194.217 ** 2

    f[np.abs(f - 0) < 1e-17] = 1e-17
    f = f ** 2
    num = c1 * f ** 4
    den = ((c2 + f) ** 2) * (c3 + f) * (c4 + f) * ((c5 + f) ** 2)

    A = num / den
    if plotFilter:
        plt.figure(2)
        plt.semilogx(np.sqrt(f), 10 * np.log10(A))
        plt.title('A-weighting Filter')
        plt.xlabel('Frequency (Hz)')
        plt.ylabel('Magnitude (dB)')
        plt.xlim([10, 100e3])
        plt.ylim([-70, 10])

        plt.figure(3)
        plt.plot(np.sqrt(f), A)
        plt.title('A-weighting Filter')
        plt.xlabel('Frequency (Hz)')
        plt.ylabel('Amplitude')
        plt.xlim([0, 44.1e3 / 2])

        # 在这里返回当前图片的存储路径
        img_path = "../image/{}.png".format(content[:-4] + img_name)
        plt.savefig(img_path)
    return A


# 获取文件绝对路径, 处理当前这个数据
def return_data():
    # 接收前端返回的文件名， 在这里拼接成文件路径
    # file_path = dir_path + content
    content = 'F2 trotte run02 ( 0.00-11.60 s).asc'
    file_path = '/media/pysuper/文件/大众/file/Practice_Data/F2 trotte run02 ( 0.00-11.60 s).asc'
    file_head_content = ""
    data_content = ""
    file = open(file_path, "r", encoding="utf-8", errors="ignore")

    while True:
        file_content = file.readline()
        if not file_content:
            break
        if not file_content[0].isdigit():  # 如果当前行是数字开头，就用data保存
            file_head_content += file_content
        elif file_content[0].isdigit():
            data_content += file_content

    # 处理头文件中的channel字典
    header_info = re.match(r"(.*?)\[CodedChannel0](.*?)\[Channel\d](.*)", file_head_content, re.S).group(1)
    detail_key_list = []
    detail_value_list = []
    head_channel_info = re.findall(r'(Channel \d+:	.*?),', header_info, re.S)
    for head_channel in head_channel_info:
        key = re.search(r"(.*):", head_channel, re.S).group(1).strip()
        value = re.search(r":(.*)", head_channel, re.S).group(1).strip()
        detail_key_list.append(key)
        detail_value_list.append(value)
    channel_dict = {"key": detail_key_list, "value": detail_value_list}

    # 在上面处理文件的时候，把文件中的数据保存到一个变量中，在这里解析data中的数据，把图片保存，返回给前端一个绝对路径
    # TODO：这里的两列数据是需要变化的
    raw_time = []
    raw_vl_data = []
    raw_vr_data = []
    raw_hl_data = []
    raw_hr_data = []

    # 开始处理图像显示的问题   # 在上面把所有的数据都放在了字符创里面，在下面使用的时候，是无法读取的
    content_line_list = data_content.split('\n')  # 所有数据都读完了
    for read_line in content_line_list:
        content_list = read_line.split(' ')  # 一行数据的字符串列表
        items = []
        for contents in content_list:
            try:
                items.append(float(contents))
            except:
                continue
        try:  # 读到最后一行的时候就没有数据了
            raw_time.append(items[1])
            raw_vl_data.append(items[2])
            raw_vr_data.append(items[3])
            raw_hl_data.append(items[4])
            raw_hr_data.append(items[5])
        except:
            continue
    vl = "vl"
    vr = "vr"
    hl = "hl"
    hr = "hr"
    img_vl_path = parse_data(content, vl, raw_vl_data)
    img_vr_path = parse_data(content, vr, raw_vr_data)
    img_hl_path = parse_data(content, hl, raw_hl_data)
    img_hr_path = parse_data(content, hr, raw_hr_data)

    img_path = {
        "img_vl_path": img_vl_path,
        "img_vr_path": img_vr_path,
        "img_hl_path": img_hl_path,
        "img_hr_path": img_hr_path
    }

    return file_path, channel_dict, img_path


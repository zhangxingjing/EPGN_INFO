

# 编写算法对应图片位置的接口
class CalculateImage(object):
    """
    根据算法与图片之间的关系，调整PPT中图片的位置
        1. 应该是一个文件按照一定的顺序执行算法
        2. 每个算法生成的图片应该放在指定的位置
            a. 每张幻灯片中，通过当前结果使用的通道，确定图片所在的位置
            b. 出现6张结果图的时候，应该每个模块追加一张幻灯片，将图片放进去
        3. 先将目前有的算法，能出结果的添加进去，后面有新的算法添加进来，就接着向里面添加
    """

    def __init__(self):
        """
        初始化的算法信息
        1. F3/G3 VZ 是什么信息，我可以通过它获取到什么数据，它有什么用途？ 可以用来知道是哪个算法（整车）
        2. 当前的顺序是不是PPT的顺序？ 是的
        3. LL D/P/R/N mit AC 是什么意思，用图片生成图片怎么处理？ 由工况对应算法，
        """
        ppt_sort = [
            {"F3/G3 VZ": "Level VS RPM"},
            {"F3/G3 VS": "Level VS RPM"},
            {"F5/G5 VZ": "2nd Order VS RPM"},
            {"KB 80-20": "FFT"},
            {"Start-Stop": "滤波器，目前还没有"},
            [
                {"LL D/P/R/N mit AC": "Level VS Time"},
                {"LL D/P/R/N ohne AC": "Level VS Time"},
                {"LL D/P/R/N mit All": "Level VS Time"}
            ]
        ]
        pass

    def rule(self):
        """
        算法对应图片位置的规则
        :return: 图片的位置
        """
        pass

    def parse_ppt(self):
        """
        将图片根据rule放到制定的位置上去
        :return: 图片位置存放状态
        """
        pass




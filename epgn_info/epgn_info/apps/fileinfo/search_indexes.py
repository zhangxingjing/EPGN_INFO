from haystack import indexes

from .models import Fileinfo


class FileIndex(indexes.SearchIndex, indexes.Indexable):
    """
    FileInfo索引数据模型类
    """
    text = indexes.CharField(document=True, use_template=True)

    def get_model(self):
        """返回建立索引的模型类"""
        return Fileinfo

    # 返回指定的部分数据
    def index_queryset(self, using=None):
        """返回要拿去建立索引的 数据 查询集"""
        return self.get_model().objects.filter()

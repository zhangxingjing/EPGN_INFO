import time
from users.models import User
from rest_framework import serializers
from .models import Category, Bug


# Bug分类的序列化器
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


# class DeveloperSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Developer
#         fields = ["id", "name"]


# Bug的序列化器
class BugSerializer(serializers.ModelSerializer):
    level = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    developer = serializers.SerializerMethodField()
    author = serializers.CharField(source="author.username")
    category = serializers.CharField(source="category.name")

    class Meta:
        model = Bug
        fields = "__all__"

    def get_level(self, obj):
        return obj.get_level_display()
        # if obj.level == 0:
        #     return "Ⅰ"
        # elif obj.level == 1:
        #     return "Ⅱ"
        # elif obj.level == 2:
        #     return "Ⅲ"
        # elif obj.level == 3:
        #     return "Ⅳ"

    def get_status(self, obj):
        return obj.get_status_display()
        # if obj.status == 0:
        #     return "未处理"
        # elif obj.status == 1:
        #     return "处理中"
        # elif obj.status == 2:
        #     return "已处理"

    def get_developer(self, obj):
        return obj.get_developer_display()
        # if obj.developer == 1:
        #     return "郑兴涛"
        # elif obj.developer == 2:
        #     return "吴斌"
    #
    # def create(self, validated_data):
    #     """
    #     无法使用POST请求时，自添加create()方法
    #     :param validated_data: 携带序列化之后的数据
    #     :return: 创建的信息
    #     """
    #     print(validated_data)
    #     author = User.objects.get(id=int(validated_data['author']["username"]))
    #     category = Category.objects.get(id=int(validated_data['category']["name"]))
    #     # developer = Developer.objects.get(id=int(validated_data['developer']["name"]))
    #
    #     bug = Bug.objects.create(
    #         author=author,
    #         level=validated_data['level'],
    #         category=category,
    #         status=validated_data['status'],
    #         content=validated_data['content'],
    #         developer=validated_data['developer'],
    #         create_time=time.strftime('%Y-%m-%d', time.localtime(time.time()))
    #     )
    #     # 添加多对多表中的记录
    #     # book.authors.add(*validated_data['authors'])
    #     return bug

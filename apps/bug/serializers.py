import time
from users.models import User
from rest_framework import serializers
from .models import Category, Bug, Developer


# Bug分类的序列化器
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class DeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = ["id", "name"]


# Bug的序列化器
class BugSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.username")
    category = serializers.CharField(source="category.name")
    developer = serializers.CharField(source="developer.name")

    # level = serializers.SerializerMethodField()
    # status = serializers.SerializerMethodField()

    class Meta:
        model = Bug
        fields = "__all__"

    def get_level(self, obj):
        return obj.get_level_display()

    def get_status(self, obj):
        return obj.get_status_display()

    def create(self, validated_data):
        """
        无法使用POST请求时，自添加create()方法
        :param validated_data: 携带序列化之后的数据
        :return: 创建的信息
        """
        author = User.objects.get(id=int(validated_data['author']["username"]))
        category = Category.objects.get(id=int(validated_data['category']["name"]))
        developer = Developer.objects.get(id=int(validated_data['developer']["name"]))

        bug = Bug.objects.create(
            author=author,
            level=validated_data['level'],
            category=category,
            status=validated_data['status'],
            content=validated_data['content'],
            developer=developer,
            create_time=time.strftime('%Y-%m-%d', time.localtime(time.time()))
        )
        # 添加多对多表中的记录
        # book.authors.add(*validated_data['authors'])
        return bug

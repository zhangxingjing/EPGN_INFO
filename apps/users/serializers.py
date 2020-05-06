import re
from rest_framework import serializers
from .models import User, Task, Section, Direction
from rest_framework_jwt.settings import api_settings


# 创建用户 ==> 不让用户自己创建
class CreateUserSerializer(serializers.ModelSerializer):
    # ModelSerializer ==> 模型类序列化器(校验用户提交的数据)
    # 用户注册
    """
    提交字段
    1. username
    5. nickname
    2. password
    3. password2
    5. allow
    返回字段
    1. id
    2. username
    3. jwt token
    """
    nickname = serializers.CharField(label="昵称", write_only=True)
    password2 = serializers.CharField(label='确认密码', write_only=True)
    allow = serializers.CharField(label='是否同意协议', write_only=True)
    token = serializers.CharField(label='token', read_only=True)

    class Meta:
        # 指明参照哪个模型类
        model = User
        # 指明为模型类的哪些字段生成
        fields = ['id', 'username', 'nickname', 'password', 'password2', 'allow', 'token']

        # 在Meta中, 重新定义, 改动字段属性
        extra_kwargs = {
            'password': {
                'write_only': True,
                'min_length': 8,
                'max_length': 32,
            },
            'nickname': {
                'min_length': 5,
                'max_length': 20,
            }
        }

    def validate_username(self, value):
        if User.objects.filter(username=value):
            raise serializers.ValidationError('当前用户名已存在')
        return value

    def validate_nickname(self, value):
        # 直接使用'calidate_参数名' 完成对当前这个参数的校验 ==> 这里是自己定义编写的函数校验参数
        if not re.match(r'(\d+|\w+)', value):
            raise serializers.ValidationError('请输入正确的昵称')
        return value

    def validate_allow(self, value):
        if value != 'true':
            raise serializers.ValidationError('请点击同意协议')
        return value

    def validate(self, attrs):
        password = attrs['password']
        password2 = attrs['password2']
        if password != password2:
            raise serializers.ValidationError('密码不匹配')
        return attrs

    def create(self, validated_data):
        # 删除用户提交的多余数据创建用户
        # pprint(validated_data)
        del validated_data['password2']
        del validated_data['allow']
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()

        # 生成jwt token
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)

        user.token = token
        return user


# 用户登录的序列化器
class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


# 用户详细信息序列化器
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # 指明参照哪个模型类
        fields = ('id', 'username', 'job_number', 'update_files_data', 'download_files_data', 'task')  # 指明为模型类的哪些字段生成


# 用户个人数据序列化器
class UserFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # 指明参照哪个模型类
        fields = "__all__"


# 用户任务的序列化器
class UserTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


# 用户部门的序列化器
class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = "__all__"


# 用户专业方向的序列化器
class DirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direction
        fields = "__all__"

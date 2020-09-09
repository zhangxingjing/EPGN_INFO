from pprint import pprint
from users.models import User
from rest_framework import status
from .models import Laboratory, WorkTime, TestContent
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet, ModelViewSet
from .serializers import LaboratorySerializer, TestContentSerializer, WorkTimeSerializer


class LaboratoryInfo(ViewSet):
    # 返回数据库中所有的试验室-试验内容

    def room(self, request):
        rooms_obj = Laboratory.objects.all()
        serializer = LaboratorySerializer(rooms_obj, many=True)
        return Response(serializer.data)

    def test_(self, request, id):
        test_obj = TestContent.objects.filter(title__id=id)
        serializer = TestContentSerializer(test_obj, many=True)
        return Response(serializer.data)


class WorkTimeInfo(ModelViewSet):
    """
    用户工时的CURD操作
    """
    queryset = WorkTime.objects.all()
    serializer_class = WorkTimeSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # 用户提交的数据都在serializer.data里面
        pprint(serializer.data)
        task_manage = serializer.data["task_manage"]
        task_user = serializer.data["task_user"]

        print(task_manage[0].username, task_user.username)
        # 添加一个工时的时候，把当前工时的信息，发送到用户任务中
        # 当工时审批通过，就不再在任务中显示
        # User.objects.filter(id=serializer.data)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


def save_xls(request):
    # 将数据保存到xls中
    ...

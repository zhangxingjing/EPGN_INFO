import re
import xlwt
from django.views import View
from rest_framework import status
from users.models import User, Task
from django.http import JsonResponse
from fileinfo.models import Platform
from rest_framework.response import Response
from .models import Laboratory, WorkTime, TestContent
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
        # TODO: TEST--直接使用对象的方式返回
        try:
            new_time = WorkTime(
                task_user=User.objects.get(username=request.data["task_user"]),
                create_time=request.data["create_time"],
                car_model=Platform.objects.get(name=request.data["car_model"]),
                car_number=request.data["car_number"],
                vin=request.data["vin"],
                task_title=request.data["task_title"],
                task_content=TestContent.objects.get(name=request.data["task_content"]),
                task_manager=User.objects.get(username=request.data["task_manager"]),
                check_task=1,
                check_data=1,
                check_report=1
            )
            new_time.save()

            # 工时信息提交之后，应该要把当前的任务发送到任务系统中，让负责人查看
            new_task = Task(
                name="工时审核--{}".format(User.objects.get(username=request.data["task_user"]))
            )
            new_task.save()

            # 在指定的用户任务信息中添加当前任务
            # user_new_task = User()
            # task_manage_list = TestContent.objects.get(name=request.data["task_content"]).task_manage.all() # 这是所有的负责人

            # 在这里使用用户选择的用户就可以了
            task_manager = User.objects.get(username=request.data["task_manager"])
            task_manager.task.add(new_task)

            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            print("error:", e)
            return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        return Response(serializer.data)


class CheckWorkTime(View):
    """
    manager >> tester ==> 处理CURD
    """

    def get(self, request, *args, **kwargs):
        # manage >> tester 的工时信息 ==> 表格中的所有信息
        try:
            current_user_id = request.GET.get("current_user_id", None)
            current_user_tasks = User.objects.get(id=current_user_id).task.all()

            items = []
            for current_user_task in current_user_tasks:
                tester_name = re.search(r'.*--(.*)', current_user_task.name).group(1)
                tester = User.objects.get(username=tester_name)
                work_time = WorkTime.objects.get(task_user__id=tester.id)

                item = {
                    "room": Laboratory.objects.get(manage_user_id=tester.id).name,
                    "date": work_time.create_time,
                    "car_model": work_time.car_model.name,
                    "car_number": work_time.car_number,
                    "vim": work_time.vin,
                    "task": work_time.task_title,
                    "task_content": work_time.task_content.name,
                    "work_time": 123,
                    "role": work_time.task_content.default_role,
                    "manager": work_time.task_manager.username,
                    "check_task": work_time.check_task,
                    "check_data": work_time.check_data,
                    "check_report": work_time.check_report,
                }
                items.append(item)
            return JsonResponse({"data": items})
        except Exception as e:
            print(e)
            return JsonResponse({"error": "???"})

    def post(self, request, *args, **kwargs):
        # manage >> tester 的工时信息 ==> 是否确认
        try:
            task_id = request.POST.get("task_id", None)
            check_task_id = request.POST.get("check_task_id", None)
            current_user_id = request.POST.get("current_user_id", None)  # 当前用户
            current_user_task = Task.objects.get(id=task_id)

            tester_name = re.search(r'.*--(.*)', current_user_task.name).group(1)
            tester = User.objects.get(username=tester_name)
            work_time = WorkTime.objects.get(task_user__id=tester.id)
            work_time.check_task = int(check_task_id)
            work_time.save()
            return JsonResponse({"data": "OK!", "code": 1})
        except Exception as e:
            return JsonResponse({"error": e, "code": 0})


def save_xls_download(request):
    """
    这里如何触发：
        页面点击
        定时生成
    :param request:前端请求request对象
    :return:当前数据的xls文件
    """
    # 将数据保存到xls中
    items = [
        {
            "id": 1,
            "task_user": "张晓康",
            "试验室": "test_content.test_title",
            "日期": "2020-09-09",
            "车型": "T-Cross",
            "车号": "123",
            "Vin": "123345",
            "任务名称": "test_content.task_title",
            "任务详细内容": "test_content.name",
            "角色": "test_content.default_role",
            "工时": "test_content.test_time",
            "任务负责人": "test_content.task_manage",
            "总工时": 23,
            "是否确认任务内容": "未审核",
            "是否上传数据": "qwe",
            "是否有报告": "false",
        }, {
            "id": 1,
            "task_user": "张晓康",
            "试验室": "test_content.test_title",
            "日期": "2020-09-09",
            "车型": "T-Cross",
            "车号": "123",
            "Vin": "123345",
            "任务名称": "test_content.task_title",
            "任务详细内容": "test_content.name",
            "角色": "test_content.default_role",
            "工时": "test_content.test_time",
            "任务负责人": "test_content.task_manage",
            "总工时": 23,
            "是否确认任务内容": "未审核",
            "是否上传数据": "qwe",
            "是否有报告": "false",
        }, {
            "id": 1,
            "task_user": "张晓康",
            "试验室": "test_content.test_title",
            "日期": "2020-09-09",
            "车型": "T-Cross",
            "车号": "123",
            "Vin": "123345",
            "任务名称": "test_content.task_title",
            "任务详细内容": "test_content.name",
            "角色": "test_content.default_role",
            "工时": "test_content.test_time",
            "任务负责人": "test_content.task_manage",
            "总工时": 23,
            "是否确认任务内容": "未审核",
            "是否上传数据": "qwe",
            "是否有报告": "false",
        }, {
            "id": 1,
            "task_user": "张晓康",
            "试验室": "test_content.test_title",
            "日期": "2020-09-09",
            "车型": "T-Cross",
            "车号": "123",
            "Vin": "123345",
            "任务名称": "test_content.task_title",
            "任务详细内容": "test_content.name",
            "角色": "test_content.default_role",
            "工时": "test_content.test_time",
            "任务负责人": "test_content.task_manage",
            "总工时": 23,
            "是否确认任务内容": "未审核",
            "是否上传数据": "qwe",
            "是否有报告": "false",
        }, {
            "id": 1,
            "task_user": "张晓康",
            "试验室": "test_content.test_title",
            "日期": "2020-09-09",
            "车型": "T-Cross",
            "车号": "123",
            "Vin": "123345",
            "任务名称": "test_content.task_title",
            "任务详细内容": "test_content.name",
            "角色": "test_content.default_role",
            "工时": "test_content.test_time",
            "任务负责人": "test_content.task_manage",
            "总工时": 23,
            "是否确认任务内容": "未审核",
            "是否上传数据": "qwe",
            "是否有报告": "false",
        }, {
            "id": 1,
            "task_user": "张晓康",
            "试验室": "test_content.test_title",
            "日期": "2020-09-09",
            "车型": "T-Cross",
            "车号": "123",
            "Vin": "123345",
            "任务名称": "test_content.task_title",
            "任务详细内容": "test_content.name",
            "角色": "test_content.default_role",
            "工时": "test_content.test_time",
            "任务负责人": "test_content.task_manage",
            "总工时": 23,
            "是否确认任务内容": "未审核",
            "是否上传数据": "qwe",
            "是否有报告": "false",
        }, {
            "id": 1,
            "task_user": "张晓康",
            "试验室": "test_content.test_title",
            "日期": "2020-09-09",
            "车型": "T-Cross",
            "车号": "123",
            "Vin": "123345",
            "任务名称": "test_content.task_title",
            "任务详细内容": "test_content.name",
            "角色": "test_content.default_role",
            "工时": "test_content.test_time",
            "任务负责人": "test_content.task_manage",
            "总工时": 23,
            "是否确认任务内容": "未审核",
            "是否上传数据": "qwe",
            "是否有报告": "false",
        }
    ]
    file = xlwt.Workbook(encoding='utf-8')
    table = file.add_sheet('data')
    alignment = xlwt.Alignment()
    alignment.horz = xlwt.Alignment.HORZ_CENTER
    alignment.vert = xlwt.Alignment.VERT_CENTER
    style = xlwt.XFStyle()
    style.alignment = alignment

    # 写表头
    row0 = [
        "序号", "id", "task_user", "试验室", "日期",
        "车型", "车号", "Vin", "任务名称", "任务详细内容", "角色", "工时", "任务负责人", "总工时",
        "是否确认任务内容", "是否上传数据", "是否有报告"
    ]
    for i in range(0, len(row0)):
        table.write(0, i, row0[i], style)

    # 写数据
    data = {}
    num = 0
    for item in items:
        num += 1
        data.update({
            num: [
                item["id"], item["task_user"], item["试验室"], item["日期"],
                item["车型"], item["车号"], item["Vin"], item["任务名称"], item["任务详细内容"], item["角色"], item["工时"],
                item["任务负责人"],
                item["总工时"],
                item["是否确认任务内容"], item["是否上传数据"], item["是否有报告"]
            ]
        })

    l_data = []
    for x in [a for a in data]:
        t = [int(x)]
        for a in data[x]:
            t.append(a)
        l_data.append(t)

    for i, p in enumerate(l_data):
        for j, q in enumerate(p):
            table.write(i + 1, j, q, style)

    # 设置单元格宽度
    table.col(0).width = 2000
    table.col(1).width = 2000
    table.col(2).width = 2000
    table.col(3).width = 5000
    table.col(4).width = 3000
    table.col(5).width = 3000
    table.col(6).width = 2000
    table.col(7).width = 2000
    table.col(8).width = 5000
    table.col(9).width = 5000
    table.col(10).width = 2000

    file.save('/home/zheng/Desktop/formatting.xls')

    """使用不同的方式，把数据保存到xls中
    # 将json中的key作为header, 也可以自定义header（列名）
    header = (
        "id", "task_user", "试验室", "日期",
        "车型", "车号", "Vin", "任务名称", "任务详细内容", "角色", "工时", "任务负责人",
        "总工时", "是否确认任务内容", "是否上传数据", "是否有报告"
    )

    # 循环里面的字典，将value作为数据写入进去
    data = []
    for row in rows:
        data.append((
            row["id"], row["task_user"], row["试验室"], row["日期"],
            row["车型"], row["车号"], row["Vin"], row["任务名称"], row["任务详细内容"], row["角色"], row["工时"], row["任务负责人"],
            row["总工时"],
            row["是否确认任务内容"], row["是否上传数据"], row["是否有报告"]
        ))

    # 使用tablib写入数据
    data = tablib.Dataset(*data, headers=header)
    with open('/home/zheng/Desktop/formatting.xls', "wb") as f:
        f.write(data.xls)
    """

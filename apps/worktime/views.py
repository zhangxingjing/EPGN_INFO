import xlwt
from django.shortcuts import render
from users.models import User, Task
from django.http import JsonResponse
from fileinfo.models import Platform
from rest_framework.response import Response
from django.db import transaction, DatabaseError
from fileinfo.serializers import CarModelSerializer
from .models import Laboratory, WorkTask, TaskDetail
from rest_framework.viewsets import ViewSet, ModelViewSet
from .serializers import LaboratorySerializer, WorkTaskSerializer, TaskDetailSerializer


class WaitViewSet(ViewSet):
    """
    进入页面时候，返回到前端的数据
    """

    def get_items(self, request):
        try:
            user_id = request.GET.get("user_id", None)
            laboratory_obj = Laboratory.objects.get(manager__id=user_id)
            laboratory = LaboratorySerializer(laboratory_obj).data

            car_obj = Platform.objects.filter(parent_id__gte=100)  # 大于等于
            car_model = CarModelSerializer(car_obj, many=True)

            test_obj = TaskDetail.objects.filter(category=1, laboratory=laboratory_obj, parent__id=None)
            tests = TaskDetailSerializer(test_obj, many=True)
            test_data = []
            test_manager = []
            for test in tests.data:
                test_data.append({
                    "name": test["name"],
                    "hour": test["hour"],
                    "role": test["role"],
                    "detail": test["detail"]
                })
                test_manager = test["task_manager"]

            manager_obj = TaskDetail.objects.filter(category=2, parent__id=None)
            managers = TaskDetailSerializer(manager_obj, many=True)
            manager_data = []
            manage_manager = []
            for manager in managers.data:
                manager_data.append({
                    "name": manager["name"],
                    "hour": manager["hour"],
                    "role": manager["role"],
                    "detail": manager["detail"]
                })
                manage_manager = manager["task_manager"]

            data = {
                "room": laboratory["name"],
                "carModal": sorted(car_model.data, key=lambda i: i["name"][0]),
                "taskInfo": [
                    {
                        "test": {
                            "data": test_data,
                            "manager": test_manager
                        }
                    }, {
                        "manage": {
                            "data": manager_data,
                            "manager": manage_manager
                        }
                    }
                ]
            }
            """
            返回json
                return JsonResponse({"status": True, "msg": data})
            except Exception as e:
                return JsonResponse({"status": False, "msg": "数据请求失败：{}".format(e)})
            """

            return Response(data=data)
        except Exception as e:
            return Response("数据请求失败！")

    def submit(self, request):
        return render(request, "worktime/submit.html")

    def search(self, request):
        return render(request, "worktime/search.html")


class LaboratoryViewSet(ViewSet):
    """
    返回数据库中所有的试验室-试验内容
    """

    def room(self, request):
        rooms_obj = Laboratory.objects.all()
        serializer = LaboratorySerializer(rooms_obj, many=True)
        return Response(serializer.data)

    def info(self, request, id):
        # 指定实验室下面的数据信息
        task_type = request.GET.get("type", None)
        if task_type:
            test_obj = TaskDetail.objects.filter(laboratory__id=id, category=task_type)
        else:
            test_obj = TaskDetail.objects.filter(laboratory__id=id)
        serializer = TaskDetailSerializer(test_obj, many=True)
        return Response(serializer.data)


class WorkTaskViewSet(ModelViewSet):
    queryset = WorkTask.objects.all()
    serializer_class = WorkTaskSerializer


class TaskDetailView(ModelViewSet):
    """
    用户工时的CURD操作
    """
    queryset = TaskDetail.objects.all()
    serializer_class = TaskDetailSerializer

    def create(self, request, *args, **kwargs):
        # TODO: TEST--直接使用对象的方式返回
        try:
            with transaction.atomic():  # MySQL的事务，执行回滚
                # 提交任务时添加到任务中
                new_task_info = Task(
                    name="工时审核--{}".format(User.objects.get(username=request.data["userId"]))
                )
                new_task_info.save()

                # 将任务发送给任务管理员
                task_manager = User.objects.get(username=request.data["manager"])
                task_manager.task.add(new_task_info)

                work_obj = WorkTask(
                    vin=request.data["carVin"],
                    hours=request.data["totalHour"],
                    car_number=request.data["carNum"],
                    task_title=request.data["taskName"],
                    create_time=request.data["creatTime"],
                    task_manager=User.objects.get(username=request.data["manager"]),
                    task_user=User.objects.get(username=request.data["userId"]),
                    car_model=Platform.objects.get(name=request.data["carModal"]),
                    task=new_task_info
                )
                work_obj.save()

                # 需要将任务类别关联到详细信息中
                for task in request.data["content"]:
                    task_obj = TaskDetail(
                        # id=(TaskDetail.objects.all().order_by('-id')[:1][0].id + 1    # 使用id最后一个
                        hour=task["taskHour"],  #
                        name=task["taskName"],  #
                        color=False,
                        role=task["taskRole"],  #
                        detail=task["taskDetail"],  #
                        category=1,
                        laboratory=Laboratory.objects.get(id=request.data["laboratoryId"]),
                        parent=work_obj,
                        # task_manager=[User.objects.get(username=request.data["manager"])]
                    )
                    task_obj.save()
                    task_obj.task_manager.add(User.objects.get(username=request.data["manager"]))

                return JsonResponse({"status": True})
        except DatabaseError:
            return JsonResponse({"status": False, "msg": "当前工时上传失败，".format(DatabaseError)})

    def list(self, request, *args, **kwargs):
        try:
            result = []
            user_id = request.GET.get("user_id")
            detail = TaskDetail.objects.filter(
                id__gt=TaskDetail.objects.filter(parent__id=None).first().id,  # 有parent_id的开始查找
                parent__task_user__id=user_id  # 指定当前用户数据
            )

            """
            # 链式调用
            items = TaskDetail.objects.filter(id__gt=44, parent__task_user__id=request.GET.get("user_id"))
            for item in items:
                result.append({
                    "id": item.parent.id,
                    "room": item.laboratory.name,
                    "creatTime": item.parent.create_time,
                    "carModal": item.parent.car_model.name,
                    "carVin": item.parent.vin,
                    "taskName": item.parent.task_title,
                    "taskDetail_1": item.name,
                    "taskDetail_2": item.detail,
                    "taskHour": item.hour,
                    "taskRole": item.role,
                    "manager": item.parent.task_manager.username,  # 这里使用的应该是单个用户
                    "totalHour": item.parent.hours,
                    "taskStatus": item.parent.check_task,
                })
            return JsonResponse(
                {
                    "code": 0,
                    "msg": "q",
                    "count": 1233,
                    "data": result
                }
            )
            """

            # 序列化器返回
            detail_serializer = TaskDetailSerializer(detail, many=True).data
            for item in detail_serializer:
                work = WorkTask.objects.get(id=item["parent"])
                task_serializer = WorkTaskSerializer(work).data
                result.append({
                    "id": task_serializer["id"],
                    "room": item["name"],
                    "creatTime": task_serializer["create_time"],
                    "carModal": task_serializer["car_model"],
                    "carVin": task_serializer["vin"],
                    "taskName": task_serializer["task_title"],
                    "taskDetail_1": item["name"],
                    "taskDetail_2": item["detail"],
                    "taskHour": item["hour"],
                    "taskRole": item["role"],
                    "manager": task_serializer["task_manager"],  # 这里使用的应该是单个用户
                    "totalHour": task_serializer["hours"],
                    "taskStatus": task_serializer["check_task"],
                })
            return JsonResponse(
                {
                    "code": 0,
                    "msg": "数据请求成功！",
                    "count": len(result),
                    "data": result
                }
            )
        except Exception as e:
            return JsonResponse({"status": False, "msg": e})

    def update(self, request, *args, **kwargs):

        # 在这里修改用户的任务状态-->确定一下前端需要修改哪些数据
        print(request.data)

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        return Response(serializer.data)


class CheckWorkTime(ModelViewSet):
    """
    manager >> tester ==> 处理CURD
    """
    queryset = TaskDetail.objects.all()
    serializer_class = TaskDetailSerializer

    def list(self, request, *args, **kwargs):
        try:
            result = []
            user_id = request.GET.get("user_id")  # 当前登录的应该是管理员
            detail = TaskDetail.objects.filter(
                id__gt=TaskDetail.objects.filter(parent__id=None).first().id,  # 有parent_id的开始查找
                parent__task_manager__id=user_id  # 指定当前`管理员`的数据
            )

            # 序列化器返回
            detail_serializer = TaskDetailSerializer(detail, many=True).data
            for item in detail_serializer:
                work = WorkTask.objects.get(id=item["parent"])
                task_serializer = WorkTaskSerializer(work).data
                result.append({
                    "id": task_serializer["id"],
                    "room": item["name"],
                    "creatTime": task_serializer["create_time"],
                    "carModal": task_serializer["car_model"],
                    "carVin": task_serializer["vin"],
                    "taskName": task_serializer["task_title"],
                    "taskDetail_1": item["name"],
                    "taskDetail_2": item["detail"],
                    "taskHour": item["hour"],
                    "taskRole": item["role"],
                    "manager": task_serializer["task_manager"],  # 这里使用的应该是单个用户
                    "totalHour": task_serializer["hours"],
                    "taskStatus": task_serializer["check_task"],
                })
            return JsonResponse(
                {
                    "code": 0,
                    "msg": "数据请求成功！",
                    "count": len(result),
                    "data": result
                }
            )
        except Exception as e:
            return JsonResponse({"status": False, "msg": e})


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
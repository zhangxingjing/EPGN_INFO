import datetime
import json
import os

import xlwt
from django.db import transaction, DatabaseError
from django.db.models import Q
from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.shortcuts import render
from django.utils.http import urlquote
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet, ModelViewSet

from fileinfo.models import Platform
from fileinfo.serializers import CarModelSerializer
from users.models import User, Task
from .models import Laboratory, WorkTask, TaskDetail
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
                # test_manager = sorted(test["task_manager"], key=lambda i: i["name"][0]),

            manager_obj = TaskDetail.objects.filter(category=2, laboratory=laboratory_obj, parent__id=None)
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
                            "data": sorted(test_data, key=lambda i: i["name"], reverse=True),
                            "manager": sorted(test_manager, key=lambda x: x.encode("gbk"))
                        }
                    }, {
                        "manage": {
                            "data": sorted(manager_data, key=lambda i: i["name"], reverse=True),
                            "manager": sorted(manage_manager, key=lambda x: x.encode("gbk"))
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

    def check(self, request):
        return render(request, 'worktime/check.html')


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

    def list(self, request, *args, **kwargs):
        # queryset = self.filter_queryset(self.get_queryset())
        #
        # page = self.paginate_queryset(queryset)
        # if page is not None:
        #     serializer = self.get_serializer(page, many=True)
        #     return self.get_paginated_response(serializer.data)
        #
        # serializer = self.get_serializer(queryset, many=True)
        # return Response(serializer.data)

        manager_id = request.GET.get("manager_id")
        manager = User.objects.get(id=manager_id)

        #  通过 filter(~Q(parent__id=None)) 找不parent_id不为None的数据
        task_list = TaskDetail.objects.filter(~Q(parent__id=None)).filter(parent__check_task=1, task_manager=manager)
        detail_serializer = TaskDetailSerializer(task_list, many=True).data

        result = []
        for item in detail_serializer:
            work = WorkTask.objects.get(id=item["parent"])
            task_serializer = WorkTaskSerializer(work).data
            result.append({
                "id": task_serializer["id"],
                "room": item["laboratory"],  # 试验室
                "creatTime": task_serializer["create_time"],
                "carModal": task_serializer["car_model"],
                "carNumber": task_serializer["car_number"],
                "carVin": task_serializer["vin"],
                "taskName": task_serializer["task_title"],
                "taskDetail_1": item["name"],
                "taskDetail_2": item["detail"],
                "taskHour": item["hour"],
                "taskRole": item["role"],
                "manager": task_serializer["task_manager"],  # 这里使用的应该是单个用户
                "totalHour": task_serializer["hours"],
                "taskStatus": task_serializer["check_task"],
                "color": item["color"],
            })
        return JsonResponse(
            {
                "code": 0,
                "msg": "数据请求成功！",
                "count": len(result),
                "data": result
            }
        )

    def update(self, request, *args, **kwargs):

        # 在这里修改用户的任务状态-->确定一下前端需要修改哪些数据
        try:
            with transaction.atomic():  # MySQL的事务，执行回滚
                time_status = request.data["time_status"]
                file_status = request.data["file_status"]
                report_status = request.data["report_status"]
                manager_id = request.data["manager_id"]
                partial = kwargs.pop('partial', False)

                instance = self.get_object()
                instance.check_task = time_status
                instance.save()

                # 当管理员审核通过/拒绝时，管理员的任务应该少一条
                # 拒绝的时候，在任务列表中新增一条用户未通过的任务

                # 这里操作数据的时候，必须要确定是哪条数据，然后在对数据进行任务状态的修改
                Task.objects.get(id=instance.task_id).delete()
                user = User.objects.get(id=instance.task_user_id)

                if time_status == "2":  # 审核通过
                    user_new_task = Task.objects.filter(name="工时审核未通过--{}".format(user.username)).first()
                    if user_new_task:
                        user_new_task.delete()

                elif time_status == "3":  # 审核未通过
                    user_old_task = Task(name="工时审核未通过--{}".format(user.username))
                    user_old_task.save()
                    user.task.add(user_old_task)

                # serializer = WorkTaskSerializer(instance).data
                # return Response(serializer)
                return JsonResponse({"status": True})
        except DatabaseError as e:
            return JsonResponse({"status": False, "msg": e})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()

        Task.objects.get(id=instance.task_id).delete()
        return JsonResponse({"status": True})


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
                    create_time=datetime.datetime.strptime(request.data["creatTime"], '%Y-%m-%d').date(),
                    task_manager=User.objects.get(username=request.data["manager"]),
                    task_user=User.objects.get(username=request.data["userId"]),
                    car_model=Platform.objects.get(name=request.data["carModal"]),
                    task=new_task_info
                )
                work_obj.save()

                # 需要将任务类别关联到详细信息中
                for task in json.loads(request.data["content"]):

                    laboratory = Laboratory.objects.get(name=request.data["laboratoryId"])

                    # 获取一个默认状态下的工时信息, 确认状态 ==>修改了工时，则color的值为 0
                    color_ = True
                    time_default = TaskDetail.objects.filter(laboratory=laboratory, parent__id=None, name=task["taskName"]).first()
                    if task["taskHour"] != time_default.hour:
                        color_ = False

                    task_obj = TaskDetail(
                        # id=(TaskDetail.objects.all().order_by('-id')[:1][0].id + 1    # 使用id最后一个
                        hour=task["taskHour"],  #
                        name=task["taskName"],  #
                        color=color_,
                        role=task["taskRole"],  #
                        detail=task["taskDetail"],  #
                        category=1,
                        laboratory=laboratory,
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

                # 按照指定规则排序
                rule = {"已拒绝": 0, "未审核": 1, "已通过": 2}

                result.append({
                    "id": task_serializer["id"],
                    "room": item["laboratory"],  # 试验室
                    "creatTime": task_serializer["create_time"],
                    "carModal": task_serializer["car_model"],
                    "carNumber": task_serializer["car_number"],
                    "carVin": task_serializer["vin"],
                    "taskName": task_serializer["task_title"],
                    "taskDetail_1": item["name"],
                    "taskDetail_2": item["detail"],
                    "taskHour": item["hour"],
                    "taskRole": item["role"],
                    "manager": task_serializer["task_manager"],  # 这里使用的应该是单个用户
                    "totalHour": task_serializer["hours"],
                    "taskStatus": task_serializer["check_task"],
                    "color": item["color"]
                })
            return JsonResponse(
                {
                    "code": 0,
                    "msg": "数据请求成功！",
                    "count": len(result),
                    # "data": sorted(result, key=lambda x: rule[x["taskStatus"]])
                    "data": result
                }
            )
        except Exception as e:
            return JsonResponse({"status": False, "msg": e})

    def update(self, request, *args, **kwargs):

        # 在这里修改用户的任务状态-->确定一下前端需要修改哪些数据
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
                    "color": item["color"]
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

# 姜怡伊
# 姜婷怡
# 姜亦倩
# 姜
def save_xls_download(request):
    """
    这里如何触发：
        页面点击
        定时生成
    :param request:前端请求request对象
    :return:当前数据的xls文件
    """
    # 获取已审核的数据列表
    task_list = TaskDetail.objects.filter(~Q(parent__id=None)).filter(parent__check_task=2)
    detail_serializer = TaskDetailSerializer(task_list, many=True).data
    results = []
    for item in detail_serializer:
        work = WorkTask.objects.get(id=item["parent"])
        task_serializer = WorkTaskSerializer(work).data
        results.append({
            "ID": task_serializer["id"],
            "试验员": "张晓康",
            "试验室": item["laboratory"],
            "日期": task_serializer["create_time"],
            "车型": task_serializer["car_model"],
            "车号": task_serializer["car_number"],
            "Vin": task_serializer["vin"],
            "任务名称": task_serializer["task_title"],
            "任务详细内容": item["name"],
            "角色": item["role"],
            "工时": item["hour"],
            "任务负责人": task_serializer["task_manager"],
            "总工时": task_serializer["hours"],
            "是否确认任务内容": "未审核",
            "是否上传数据": "qwe",
            "是否有报告": "false",
        })

    # 将数据写入到excel中
    file = xlwt.Workbook(encoding='utf-8')
    table = file.add_sheet('data')
    alignment = xlwt.Alignment()
    alignment.horz = xlwt.Alignment.HORZ_CENTER
    alignment.vert = xlwt.Alignment.VERT_CENTER
    style = xlwt.XFStyle()
    style.alignment = alignment

    # 写表头
    row0 = [
        "序号", "ID", "试验员", "试验室", "日期",
        "车型", "车号", "Vin", "任务名称", "任务详细内容", "角色", "工时", "任务负责人", "总工时",
        "是否确认任务内容", "是否上传数据", "是否有报告"
    ]
    for i in range(0, len(row0)):
        table.write(0, i, row0[i], style)

    # 写数据
    data = {}
    num = 0
    for item in results:
        num += 1
        data.update({
            num: [
                item["ID"], item["试验员"], item["试验室"], item["日期"],
                item["车型"], item["车号"], item["Vin"], item["任务名称"], item["任务详细内容"], item["角色"], item["工时"], item["任务负责人"], item["总工时"],
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
    table.col(0).width = 2000  # 序号
    table.col(1).width = 2000  # ID
    table.col(2).width = 2000  # 试验员
    table.col(3).width = 5000  # 试验室
    table.col(4).width = 3000  # 日期
    table.col(5).width = 5000  # 车型
    table.col(6).width = 5000  # 车号
    table.col(7).width = 5000  # Vin
    table.col(8).width = 5000  # 任务名称
    table.col(9).width = 5000  # 任务详细内容
    table.col(10).width = 2000  # 角色
    table.col(11).width = 2000  # 工时
    table.col(12).width = 5000  # 任务负责人
    table.col(13).width = 2000  # 总工时
    table.col(14).width = 5000  # 是否确认任务内容
    table.col(15).width = 5000  # 是否上传数据
    table.col(16).width = 5000  # 是否有报告

    # 文件存储路径(自动获取当前文件所在位置)
    file_name = "formatting.xls"
    current_path = os.path.abspath(__file__)
    file_path = os.path.join(os.path.abspath(os.path.dirname(current_path) + os.path.sep + "."), file_name)
    file.save(file_path)

    # 将写好的数据发送给用户
    def file_iterator(file_path, chunk_size=512):
        with open(file_path, mode='rb') as f:
            while True:
                count = f.read(chunk_size)
                if count:
                    yield count
                else:
                    break

    try:
        response = StreamingHttpResponse(file_iterator(file_path))
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="%s"' % (urlquote(file_name))
    except:
        return HttpResponse("Sorry but Not Found the File")
    return response

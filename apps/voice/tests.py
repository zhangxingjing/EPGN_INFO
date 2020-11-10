from django.test import TestCase
from crontab import CronTab
import time
# 日期获取
"""
import datetime

now_time = datetime.datetime.now().date()

# 当前天 显示当前日期是本周第几天
day_num = now_time.isoweekday()

# 计算当前日期所在周一
week_day = (now_time - datetime.timedelta(days=day_num))

# 查询一周内的数据
# all_datas = Welfare_dis.objects.filter(create_time__range=(monday, now_time))

# print(now_time)
# print(now_time - datetime.timedelta(weeks=1))


from datetime import datetime

print(datetime.now().isocalendar())  # 2020年；第19周；周2;
print(datetime.now().isocalendar()[1])  # 索引为[1]，就可以求出是当年的第多少周

now_date = datetime.now().isocalendar()

if now_date[2] == 1:
    # 说明今天是周一，新建一条上周的数据
    last_week = now_date[2] - 1
    WeekSum.object.create(
        id = last_week, # # 41   44
        sum_int = sum(Week.object.filter(id__lt=last_week)) # 这周之前所有数据的 和

    )

"""

# crontab定时任务
"""
# 创建linux系统当前用户的crontab，当然也可以创建其他用户的，但得有足够权限,如:user='root'
cron_manager  = CronTab(user="root")

# 创建任务 指明运行python脚本的命令(crontab的默认执行路径为：当前用户的根路径, 因此需要指定绝对路径)
job = cron_manager.new(command='python /home/zheng/Documents/WorkFile/EPGN_INFO/apps/voice/crontab_test.py &')

# 设置任务执行周期，每两分钟执行一次(更多方式请稍后参见参考链接)
job.setall('*/2 * * * *')

# 将crontab写入linux系统配置文件
my_user_cron.write()

"""

cron = CronTab(user='zheng')
job = cron.new(
    command='echo {} >> /home/zheng/Documents/WorkFile/EPGN_INFO/apps/voice/crontab_text'.format(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())),
    comment='id'
)

# 定时任务每天 00:00:00 执行一次
# job.minute.every(1)
job.setall("*/1 * * * *")  # 一次设置所有的时间片
cron.write()
# cron.remove_all()   # 清空所有的工作计划

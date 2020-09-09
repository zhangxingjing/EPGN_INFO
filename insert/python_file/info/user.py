# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : insert_user.py
# Datetime : 2020/9/7 下午1:16

from insert_base import *
from users.models import User, Section
from django.contrib.auth.hashers import make_password

########## K2
User.objects.create(
    username="曹诚",
    password=make_password("80602"),  # 使用JWT的密码生成方式
    phone="53818",
    job_number="80602",
    section=Section.objects.get(id=1)
)

User.objects.create(
    username="王学军",
    password=make_password("57480"),
    phone="53808",
    job_number="57480",
    section=Section.objects.get(id=1)
)

########## EPGN-1
User.objects.create(
    username="孙赫",
    password=make_password("65603"),
    phone="53835",
    job_number="65603",
    section=Section.objects.get(id=2)
)

User.objects.create(
    username="杨怡",
    password=make_password("65629"),
    phone="53843",
    job_number="65629",
    section=Section.objects.get(id=2)
)

User.objects.create(
    username="谢荣庆",
    password=make_password("15723"),
    phone="53303",
    job_number="15723",
    section=Section.objects.get(id=2)
)

User.objects.create(
    username="刘志强",
    password=make_password("66813"),
    phone="19997195386",
    job_number="66813",
    section=Section.objects.get(id=2)
)

User.objects.create(
    username="高超",
    password=make_password("63727"),
    phone="53518",
    job_number="63727",
    section=Section.objects.get(id=2)
)

User.objects.create(
    username="吴瑛",
    password=make_password("59612"),
    phone="53828",
    job_number="59612",
    section=Section.objects.get(id=2)
)

User.objects.create(
    username="余盛荣",
    password=make_password("69799"),
    phone="53842",
    job_number="69799",
    section=Section.objects.get(id=2)
)

User.objects.create(
    username="张晓康",
    password=make_password("201728"),
    phone="13764819006",
    job_number="201728",
    section=Section.objects.get(id=2)
)

User.objects.create(
    username="郑兴涛",
    password=make_password("1553"),
    phone="18895358393",
    job_number="1553",
    section=Section.objects.get(id=2)
)

User.objects.create(
    username="吴斌",
    password=make_password("202442"),
    phone="15370036657",
    job_number="202442",
    section=Section.objects.get(id=2)
)

########## EPGN-2
User.objects.create(
    username="刘先锋",
    password=make_password("59917"),
    phone="53825",
    job_number="59917",
    section=Section.objects.get(id=3)
)

User.objects.create(
    username="严小俊",
    password=make_password("68183"),
    phone="53844",
    job_number="68183",
    section=Section.objects.get(id=3)
)

User.objects.create(
    username="石建策",
    password=make_password("13664"),
    phone="53294",
    job_number="13664",
    section=Section.objects.get(id=3)
)

User.objects.create(
    username="胡冬枚",
    password=make_password("13663"),
    phone="53293",
    job_number="13663",
    section=Section.objects.get(id=3)
)

User.objects.create(
    username="张雅琼",
    password=make_password("15733"),
    phone="53129",
    job_number="15733",
    section=Section.objects.get(id=3)
)

User.objects.create(
    username="王若云",
    password=make_password("57952"),
    phone="53813",
    job_number="57952",
    section=Section.objects.get(id=3)
)

User.objects.create(
    username="费标求",
    password=make_password("12440"),
    phone="53022",
    job_number="12440",
    section=Section.objects.get(id=3)
)

User.objects.create(
    username="聂昂",
    password=make_password("15719"),
    phone="53297",
    job_number="15719",
    section=Section.objects.get(id=3)
)

User.objects.create(
    username="陈晓宇",
    password=make_password("52400"),
    phone="53812",
    job_number="52400",
    section=Section.objects.get(id=3)
)

User.objects.create(
    username="韩国华",
    password=make_password("63497"),
    phone="53823",
    job_number="63497",
    section=Section.objects.get(id=3)
)

User.objects.create(
    username="叶子阳",
    password=make_password("200759"),
    phone="53801",
    job_number="200759",
    section=Section.objects.get(id=3)
)

User.objects.create(
    username="韩晓东",
    password=make_password("202635"),
    phone="13166883373",
    job_number="202635",
    section=Section.objects.get(id=3)
)

User.objects.create(
    username="苏东弘",
    password=make_password("51470"),
    phone="53815",
    job_number="51470",
    section=Section.objects.get(id=3)
)

########## EPGN-3
User.objects.create(
    username="赵要珍",
    password=make_password("61246"),
    phone="53831",
    job_number="61246",
    section=Section.objects.get(id=4)
)

User.objects.create(
    username="吴春军",
    password=make_password("62612"),
    phone="53809",
    job_number="62612",
    section=Section.objects.get(id=4)
)

User.objects.create(
    username="刘杰",
    password=make_password("200123"),
    phone="53834",
    job_number="200123",
    section=Section.objects.get(id=4)
)

User.objects.create(
    username="杨炎平",
    password=make_password("15727"),
    phone="53325",
    job_number="15727",
    section=Section.objects.get(id=4)
)

User.objects.create(
    username="俞伟杰",
    password=make_password("57953"),
    phone="53807",
    job_number="57953",
    section=Section.objects.get(id=4)
)

User.objects.create(
    username="杨飞",
    password=make_password("68239"),
    phone="53841",
    job_number="68239",
    section=Section.objects.get(id=4)
)

User.objects.create(
    username="徐齐",
    password=make_password("13665"),
    phone="53295",
    job_number="13665",
    section=Section.objects.get(id=4)
)

User.objects.create(
    username="曾少波",
    password=make_password("201978"),
    phone="53298",
    job_number="201978",
    section=Section.objects.get(id=4)
)

User.objects.create(
    username="何稚桦",
    password=make_password("90613"),
    phone="53821",
    job_number="90613",
    section=Section.objects.get(id=4)
)

User.objects.create(
    username="黄立新",
    password=make_password("61306"),
    phone="53826",
    job_number="61306",
    section=Section.objects.get(id=4)
)

User.objects.create(
    username="林君",
    password=make_password("58422"),
    phone="53817",
    job_number="58422",
    section=Section.objects.get(id=4)
)

########## EPGN-4
User.objects.create(
    username="张梦浩",
    password=make_password("68447"),
    phone="53838",
    job_number="68447",
    section=Section.objects.get(id=5)
)

User.objects.create(
    username="赵野",
    password=make_password("12441"),
    phone="53021",
    job_number="12441",
    section=Section.objects.get(id=5)
)

User.objects.create(
    username="束元",
    password=make_password("67124"),
    phone="53811",
    job_number="67124",
    section=Section.objects.get(id=5)
)

User.objects.create(
    username="何毅",
    password=make_password("14563"),
    phone="53334",
    job_number="14563",
    section=Section.objects.get(id=5)
)

User.objects.create(
    username="陈远",
    password=make_password("68446"),
    phone="53839",
    job_number="68446",
    section=Section.objects.get(id=5)
)

User.objects.create(
    username="李献",
    password=make_password("11818"),
    phone="53102",
    job_number="11818",
    section=Section.objects.get(id=5)
)

User.objects.create(
    username="官明超",
    password=make_password("14557"),
    phone="53331",
    job_number="14557",
    section=Section.objects.get(id=5)
)

########## 试验保障
User.objects.create(
    username="严文钦",
    password=make_password("20003"),
    phone="53806",
    job_number="20003",
    section=Section.objects.get(id=6)
)

User.objects.create(
    username="纪忠良",
    password=make_password("200962"),
    phone="13818538507",
    job_number="200962",
    section=Section.objects.get(id=6)
)

User.objects.create(
    username="许云峰",
    password=make_password("57296"),
    phone="18939895077",
    job_number="57296",
    section=Section.objects.get(id=6)
)

User.objects.create(
    username="孙建忠",
    password=make_password("201727"),
    phone="15021312638",
    job_number="201727",
    section=Section.objects.get(id=6)
)

User.objects.create(
    username="刘大伟",
    password=make_password("200230"),
    phone="18616742257",
    job_number="200230",
    section=Section.objects.get(id=6)
)

User.objects.create(
    username="程鹏",
    password=make_password("10120"),
    phone="53819",
    job_number="10120",
    section=Section.objects.get(id=6)
)

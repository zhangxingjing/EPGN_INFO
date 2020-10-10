import re

from django.test import TestCase

# Create your tests here.
a = "/home/zheng/Documents/WorkFile/TEST/asphaltConstant60km8192/HR_R_ZDIC24X021.txt"

b = re.findall(r'(.*/(.*))', a)[0][1]
print(b)
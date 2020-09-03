import os
import re

from django.test import TestCase

# Create your tests here.

import difflib

from settings.dev import AUDIO_FILE_PATH

################## 1

# file_num = difflib.get_close_matches("Brummen_T-Cross", os.listdir(AUDIO_FILE_PATH), cutoff=0.94) # /0.94
# if len(file_num) > 0:
#     print(len(file_num))
#     os.mkdir(AUDIO_FILE_PATH + "Brummen_T-Cross" + "_" + str(len(file_num)))

####################### 2
# print(os.listdir(AUDIO_FILE_PATH))
# a = ['Brummen_T-Cross', 'Brummen_T-Cross_3', 'Brummen_T-Cross_2', '1_T-Cross', 'Brummen_T-Cross_1']
# c = "Brummen_T-Cross"
# print(str(a))
#
# QWE = re.findall(r'{}.*?'.format(c), str(a))

# print(len(QWE))


import re

from django.test import TestCase

a = "(Square&Lab)Leerlauf D Gang mit AC"
b = re.search(r' (.*)', a).group(1)
print(b)

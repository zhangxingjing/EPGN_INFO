from django.test import TestCase

# Create your tests here.
"""
解释器
"""


# class Context:
#     def __init__(self):
#         self.input = ""
#         self.output = ""
#
#
# class AbstractExpression:
#     def Interpret(self, context):
#         pass
#
#
# class Expression(AbstractExpression):
#     def Interpret(self, context):
#         print("terminal interpret")
#
#
# class NonterminalExpression(AbstractExpression):
#     def Interpret(self, context):
#         print("Nonterminal interpret")
#
#
# if __name__ == "__main__":
#     context = ""
#     c = []
#     c = c + [Expression()]
#     c = c + [NonterminalExpression()]
#     c = c + [Expression()]
#     c = c + [Expression()]
#     for a in c:
#         a.Interpret(context)

# list是可变类型，不能一边提取一个值，一边删除这个值
a = [2, 4, 6, 8, 10]
for b in a:
    if b % 2 == 0:
        a.remove(b)

print(a)

from . import serializers
from rest_framework.generics import CreateAPIView


# url(r'^users/$', views.UserView.as_view()),
class UserView(CreateAPIView):
    serializer_class = serializers.CreateUserSerializer

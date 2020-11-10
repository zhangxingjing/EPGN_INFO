from .views import *
from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from rest_framework_jwt.views import obtain_jwt_token

router = DefaultRouter()
router.register(r'^user', UserViewSet, basename="user")
router.register(r'^file', UserFileViewSet, basename="file")

app_name = "users"

urlpatterns = [

    url(r'^home/$', home, name="home"),

    url(r'^login/$', obtain_jwt_token, name="login"),

    url(r'^logout/$', LogoutView.as_view(), name="logout"),

]

urlpatterns += router.urls

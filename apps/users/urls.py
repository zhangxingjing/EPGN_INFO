from .views import *
from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from rest_framework_jwt.views import obtain_jwt_token

router = DefaultRouter()
router.register(r'^user', UserViewSet)
router.register(r'^file', UserFileViewSet)

urlpatterns = [

    url(r'^home/$', home),

    url(r'^login/$', obtain_jwt_token),

    url(r'^logout/$', LogoutView.as_view()),

]

urlpatterns += router.urls

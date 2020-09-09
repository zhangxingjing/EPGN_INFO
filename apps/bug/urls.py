from .views import *
from django.conf.urls import url
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'^info', BugViewSet)
router.register(r'^cate', CategoryViewSet)
router.register(r'^developer', DeveloperViewSet)

urlpatterns = [
    url(r'page/$', page),
    url(r'create/$', create),
    url(r'detail/$', detail),
]

urlpatterns += router.urls

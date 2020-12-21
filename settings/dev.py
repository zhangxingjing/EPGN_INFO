import datetime
import os
import sys
import time

from utils import log_theme

########################################################## Docker默认配置 ############################################################

REDIS_PORT = 6379
MYSQL_PORT = 3306
MYSQL_NAME = "EPGN_INFO"
DOCKER_SERVER = "127.0.0.1"

############################################################ Django默认配置 ############################################################
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

SECRET_KEY = '&y3!pn!ybfdw84p(9*_vg8gc1ls63dm1-lc74fdl@g$iyt69(#'
DEBUG = True

# 白名单
ALLOWED_HOSTS = ['*', 'localhost', '192.168.43.230']

# 中间件自定义白名单
WHITE_REGEX_URL_LIST = [
    "/",
    "/favicon.ico",
    "/user/logout/",
    "/user/sms/",
    "/user/register/",
    "/user/image/code/",
    "/user/login/sms/",
    "/user/login/user/",
]

# 子应用
INSTALLED_APPS = [
    'simpleui',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',  # 注册DRF子应用
    'rest_framework.authtoken',  # 设置Token
    'corsheaders',  # 注册CORS
    'jieba',
    'crispy_forms',
    'django_crontab',

    'users.apps.UsersConfig',  # 注册子应用
    'fileinfo.apps.FileInfoConfig',
    'calculate.apps.CalculateConfig',
    'audio.apps.AudioConfig',
    'bug.apps.BugConfig',
    'worktime.apps.WorktimeConfig',
    'script.apps.ScriptConfig',
    'voice.apps.VoiceConfig',
]

# 中间件
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # 'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',  # 关闭csrf自动校验
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',

    # TODO: 写入中间件的顺序
    # 'middleware.auth.AuthMiddleware',
]

# 模板文件
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',  # Django自带的模板渲染引擎
        'DIRS': [os.path.join('templates')],  # 配置HTML文件存放目录
        'APP_DIRS': True,  # app内部的Templates是否启用
        'OPTIONS': {
            'context_processors': [  # 模板中间件
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 配置数据库
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': DOCKER_SERVER,  # 数据库主机--> 使用Docker化的MySQL数据库
        'PORT': MYSQL_PORT,  # 数据库端口
        'USER': 'root',  # 数据库用户名
        'PASSWORD': 'root',  # 数据库用户密码
        'NAME': MYSQL_NAME,  # 43新建数据库==> 使用xadmin
        'OPTIONS': {
            'read_default_file': os.path.dirname(os.path.abspath(__file__)) + '/my.cnf',
            # 'init_command': "SET sql_mode='STRICT_TRANS_TABLES, NO_ZERO_IN_DATE,NO_ZERO_DATE, ERROR_FOR_DIVISION_BY_ZERO, NO_AUTO_CREATE_USER'",
        },
    }
}

# 日志文件
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,  # 是否禁用已经存在的日志器
    'formatters': {  # 日志信息显示的格式
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(lineno)d %(message)s'
        },
        'simple': {
            'format': '[%(levelname)s] %(message)s'
        },
    },
    'filters': {  # 对日志进行过滤
        'require_debug_true': {  # django在debug模式下才输出日志
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'handlers': {  # 日志处理方法
        'console': {  # 向终端中输出日志
            'level': 'INFO',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
        'file': {  # 向文件中输出日志
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, "logs/epgn_log.log"),  # 日志文件的位置
            'maxBytes': 300 * 1024 * 1024,
            'backupCount': 10,
            'formatter': 'verbose'
        },
    },
    'loggers': {  # 日志器
        'django': {  # 定义了一个名为django的日志器
            'handlers': ['console', 'file'],  # 可以同时向终端与文件中输出日志
            'propagate': True,  # 是否继续传递日志信息
            'level': 'INFO',  # 日志器接收的最低日志级别
        },
    }
}

# 配置缓存 ==> 要使用redis的话，要修改配置文件中的访问地址，再重启服务器
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://{}:{}/0".format(DOCKER_SERVER, REDIS_PORT),  # 修改redis数据库配置
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            # "PASSWORD": "root"  # redis密码
        }
    },
    "session": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://{}:{}/1".format(DOCKER_SERVER, REDIS_PORT),
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            # "PASSWORD": "root"  # redis密码
        }
    },
}

# 密码验证
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

SESSION_ENGINE = "django.contrib.sessions.backends.cache"  # session保存到缓存当中
SESSION_CACHE_ALIAS = "session"  # 指明session保存的session这个redis库中

# 语言、时区
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'
USE_I18N = True
USE_L10N = True
USE_TZ = False

ROOT_URLCONF = 'epgn.urls'  # 项目跟路由的位置
WSGI_APPLICATION = 'epgn.wsgi.application'

# DRF配置
REST_FRAMEWORK = {
    # 异常处理
    # 'EXCEPTION_HANDLER': 'scripts.exceptions.exception_handler',
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        #     'rest_framework.authentication.SessionAuthentication',
        #     'rest_framework.authentication.BasicAuthentication',
    ),
    # 'DEFAULT_AUTHENTICATION_CLASSES': [],
    # 分页
    'DEFAULT_PAGINATION_CLASS': 'scripts.pagination.StandardResultsSetPagination',
}

# CORS允许访问的域名
CORS_ORIGIN_WHITELIST = (
    'https://127.0.0.1:8000',
    'https://localhost:8000',
    'https://127.0.0.1:8899',
    'http://localhost:8899',
    'http://192.168.43.230:8899',
    'http://192.168.43.111:8000'
)
CORS_ALLOW_CREDENTIALS = True  # 允许携带cookie

# django文件存储
DEFAULT_FILE_STORAGE = 'utils.fastdfs.fdfs_storage.FastDFSStorage'

# 静态文件目录
STATIC_URL = '/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'static')    # TODO: uwsgi + Nginx时, 使用ROOT
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static'), ]  # TODO: 使用runserver时候，使用DIRS

# 配置自定义认证模型类
AUTH_USER_MODEL = 'users.User'  # 指明使用自定义的用户模型类
AUTHENTICATION_BACKENDS = [
    'users.utils.UsernameMobileAuthBackend',  # JWT用户认证登录
    'django.contrib.auth.backends.ModelBackend'  # Admin用户登录
]

# 配置用户登录链接
LOGIN_URL = '/login/'  # 这个路径需要根据你网站的实际登陆地址来设置

# Xadmin站点
XADMIN_TITLE = "EPGN_INFO 后台管理"  # 左上方的文字
XADMIN_FOOTER_TITLE = "small.spider.p@gmail.com"  # 最下面的文字

############################################################ DRF扩展配置 ############################################################
REST_FRAMEWORK_EXTENSIONS = {
    'DEFAULT_CACHE_RESPONSE_TIMEOUT': 60 * 60,  # 缓存时间
    'DEFAULT_USE_CACHE': 'default',  # 缓存存储
}

# 用户认证 ==> JWT
JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=1),  # 指明token的有效期
    'JWT_RESPONSE_PAYLOAD_HANDLER': 'users.utils.jwt_response_payload_handler',  # 指定使用的JWT返回的函数
}

############################################################ EPGN项目配置 ############################################################
CHANNEL_LIST = ["VR", "VL", "HR", "HL", "vorn rechits", "vorn links", "hinten rechits", "hinten links"]

FILE_HEAD_PATH = "/root/file/database/R_HDF"
FILE_READ_PATH = "/root/file/database/R_HDF/"
AUDIO_FILE_PATH = "/root/file/database/Audio/"
VOICE_FILE_PATH = "/root/file/database/Voice/"

CALCULATE_RULE = {
    # "(N)G3 VZ": "Level VS RPM",
    # "(N)G3 VZ": "2nd Order VS RPM",
    "(N)G3 VZ": "Level VS Time",
    # "(N)G3 VS": "Level VS RPM",
    "(N)G3 VS": "2nd Order VS RPM",
    "(N)G5 VZ": "2nd Order VS RPM",
    "KP 80-20": "FFT",
    "(Square&Lab)Leerlauf D Gang mit AC": "Level VS Time",
    "(Square&Lab)Leerlauf P Gang mit AC": "Level VS Time",
    "(Square&Lab)Leerlauf R Gang mit AC": "Level VS Time",
    "(Square&Lab)Leerlauf N Gang mit AC": "Level VS Time",

    "(Square&Lab)Leerlauf D Gang ohne Verbrauche": "Level VS Time",
    "(Square&Lab)Leerlauf P Gang ohne Verbrauche": "Level VS Time",
    "(Square&Lab)Leerlauf R Gang ohne Verbrauche": "Level VS Time",
    "(Square&Lab)Leerlauf N Gang ohne Verbrauche": "Level VS Time",

    "(Square&Lab)Leerlauf D Gang mit Verbrauche": "Level VS Time",
    "(Square&Lab)Leerlauf P Gang mit Verbrauche": "Level VS Time",
    "(Square&Lab)Leerlauf R Gang mit Verbrauche": "Level VS Time",
    "(Square&Lab)Leerlauf N Gang mit Verbrauche": "Level VS Time",
    "(Square&Lab)St-Sp": "Start Stop"
}
REFERENCE_CHANNEL = ["time", "EngineRPM", "EngineCoolantTemp", "VehicleSpeed"]
FALLING_LIST = ['(N)G3 VS', '(N)G5 VS', ]

TEST_CATEGORY = ((1, '测试'), (2, '管理'))
DEVELOPER_CHOICE = ((1, "郑兴涛"), (2, "吴斌"))
ROLE_CHOICE = ((1, "R"), (2, "S"), (3, "M"),)
CHECK_WORK_INFO = ((1, '未审核'), (2, '已通过'), (3, '未通过'))

################################################ Haystack 对接elasticsearch搜索引擎 ################################################
# HAYSTACK_CONNECTIONS = {
#     'default': {
#         'INDEX_NAME': 'epgn',
#         'URL': 'http://192.168.43.230:9200/',
#         "PATH": os.path.join(BASE_DIR, 'whoosh'),
#         'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
#         # 'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
#     },
# }
#
# HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'  # 当添加、修改、删除数据时，自动生成索引

########################################################## simpleui 使用 ##########################################################
SIMPLEUI_HOME_INFO = False  # 服务器信息
SIMPLEUI_ANALYSIS = False  # 不收集分析信息
SIMPLEUI_STATIC_OFFLINE = True  # 离线模式
SIMPLEUI_LOGO = 'http://127.0.0.1:8899/static/image/favicon.ico'  # LOGO
SIMPLEUI_ICON = {'Users': 'fab fa-apple', '任务信息': 'fas fa-user-tie'}  # 自定义图标

# SIMPLEUI_CONFIG = {
#     'system_keep': False,
#     'menu_display': ['Users', 'Fileinfo', 'Bug', 'Audio', 'Worktime', "Voice"],
#     'dynamic': True,
#     'menus': [
#         {
#             'name': 'Users',
#             'icon': 'fa fa-user',
#             'models': [
#                 {'name': '任务信息', 'icon': 'fa fa-list', 'url': 'users/task/'},
#                 {'name': '用户信息', 'icon': 'fa fa-user-plus', 'url': 'users/user/'},
#                 {'name': '部门信息', 'icon': 'fa fa-users', 'url': 'users/section/'},
#             ]
#         }, {
#             'name': 'Fileinfo',
#             'icon': 'fa fa-car',
#             'models': [
#                 {'name': '专业-工况', 'icon': 'fa fa-user-secret', 'url': 'fileinfo/direction/'},
#                 {'name': '动力-功率', 'icon': 'fa fa-certificate', 'url': 'fileinfo/propulsionpower/'},
#                 {'name': '变速箱', 'icon': 'fa fa-certificate', 'url': 'fileinfo/gearbox/'},
#                 {'name': '平台-车型', 'icon': 'fa fa-th', 'url': 'fileinfo/platform/'},
#                 {'name': '测试信息', 'icon': 'fa fa-th', 'url': 'fileinfo/fileinfo/'},
#                 {'name': '通道-写法', 'icon': 'fa fa-th', 'url': 'fileinfo/channel/'},
#             ]
#         }, {
#             'app': 'Bug',
#             'name': 'Bug',
#             'icon': 'fa fa-bug',
#             'models': [
#                 {'name': '错误信息', 'icon': 'far fa fa-info-circle', 'url': 'bug/bug/'},
#                 {'name': '错误分类', 'icon': 'far fa fa-barcode', 'url': 'bug/category/'},
#             ]
#         }, {
#             'app': 'Audio',
#             'name': 'Audio',
#             'icon': 'fa fa-audio-description',
#             'models': [
#                 {'name': '抱怨工况', 'icon': 'far fa-circle', 'url': 'audio/status/'},
#                 {'name': '抱怨描述', 'icon': 'far fa-circle', 'url': 'audio/description/'},
#                 {'name': '抱怨音频', 'icon': 'far fa-circle', 'url': 'audio/audio/'},
#                 {'name': '抱怨频率', 'icon': 'far fa-circle', 'url': 'audio/frequency/'},
#             ]
#         }, {
#             'name': 'Worktime',
#             'icon': 'fa fa-calendar',
#             'models': [
#                 {'name': '工时信息', 'icon': 'far fa-circle', 'url': 'worktime/worktask/'},
#                 {'name': '试验内容', 'icon': 'far fa-circle', 'url': 'worktime/taskdetail/'},
#                 {'name': '试验室信息', 'icon': 'far fa-circle', 'url': 'worktime/laboratory/'},
#             ]
#         }, {
#             'name': 'Voice',
#             'icon': 'fa fa-calendar',
#             'models': [
#                 {'name': '声音细节', 'icon': 'far fa-circle', 'url': 'voice/category/'},
#                 {'name': '抱怨分类', 'icon': 'far fa-circle', 'url': 'voice/detail/'},
#                 {'name': 'NVH 音频', 'icon': 'far fa-circle', 'url': 'voice/'},
#             ]
#         }
#     ]
# }

########################################################## Celery 配置 ##########################################################
# CELERY_URL = redis://127.0.0.1:6379/1   # redis 1作为消息代理
# CELERY_RESULT_BACKEND = redis://127.0.0.1:6379/2    # 把任务结果存在redis 2

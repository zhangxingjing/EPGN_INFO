import os
import sys
import datetime
from utils import log_theme

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

SECRET_KEY = '&y3!pn!ybfdw84p(9*_vg8gc1ls63dm1-lc74fdl@g$iyt69(#'
DEBUG = True

# 白名单
ALLOWED_HOSTS = ['*', 'localhost','192.168.43.230']

# 子应用
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 注册DRF子应用
    'rest_framework',
    'rest_framework.authtoken',  # 设置Token

    # 注册CORS
    'corsheaders',

    # 注册全文检索
    'haystack',
    'jieba',

    # 使用xadmin
    'xadmin',
    'crispy_forms',

    # 注册子应用
    'users.apps.UsersConfig',
    'fileinfo.apps.FileInfoConfig',
    'calculate.apps.CalculateConfig',
    'audio.apps.AudioConfig',
    'bug.apps.BugConfig',
    'worktime.apps.WorktimeConfig',
]

# 中间件
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',  # 关闭csrf自动校验
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'epgn.urls'  # 使用Nginx

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

WSGI_APPLICATION = 'epgn.wsgi.application'

# 配置数据库
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': '127.0.0.1',  # 数据库主机
        'PORT': 3306,  # 数据库端口
        'USER': 'root',  # 数据库用户名
        'PASSWORD': 'root',  # 数据库用户密码
        'NAME': 'EPGN_INFO',  # 43新建数据库==> 使用xadmin
        'OPTIONS': {
            'read_default_file': os.path.dirname(os.path.abspath(__file__)) + '/my.cnf',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES,"
                            "NO_ZERO_IN_DATE,NO_ZERO_DATE,"
                            "ERROR_FOR_DIVISION_BY_ZERO,"
                            "NO_AUTO_CREATE_USER'",
        },
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# 语言、时区
LANGUAGE_CODE = 'zh-hans'
TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = False

# 配置缓存 ==> 要使用redis的话，要修改配置文件中的访问地址，再重启服务器
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/0",  # 修改redis数据库配置
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PASSWORD": "root"  # redis密码
        }
    },
    "session": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PASSWORD": "root"  # redis密码
        }
    },
    'verifications': {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/2",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PASSWORD": "root"  # redis密码
        }
    },
    "history": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/3",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PASSWORD": "root"  # redis密码
        }
    },
    'contrast': {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/5",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PASSWORD": "root"  # redis密码
        }
    },
}

# session保存到缓存当中
SESSION_ENGINE = "django.contrib.sessions.backends.cache"
# 指明session保存的session这个redis库中
SESSION_CACHE_ALIAS = "session"

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

# Haystack 对接elasticsearch搜索引擎
HAYSTACK_CONNECTIONS = {
    'default': {
        'INDEX_NAME': 'epgn',
        'URL': 'http://192.168.43.230:9200/',
        "PATH": os.path.join(BASE_DIR, 'whoosh'),
        'ENGINE': 'haystack.backends.whoosh_cn_backend.WhooshEngine',
        # 'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
    },
}

# 当添加、修改、删除数据时，自动生成索引
HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'

# DRF配置
REST_FRAMEWORK = {
    # 异常处理
    'EXCEPTION_HANDLER': 'scripts.exceptions.exception_handler',
    # 'DEFAULT_AUTHENTICATION_CLASSES': (
    #     'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    #     'rest_framework.authentication.SessionAuthentication',
    #     'rest_framework.authentication.BasicAuthentication',
    # ),
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    # 分页
    'DEFAULT_PAGINATION_CLASS': 'scripts.pagination.StandardResultsSetPagination',
}

# CORS允许访问的域名
CORS_ORIGIN_WHITELIST = (
    'https://127.0.0.1:8000',
    'https://localhost:8000',
    'https://127.0.0.1:8899',
    'http://localhost:8899',
    'http://192.168.43.230:8899'
)
CORS_ALLOW_CREDENTIALS = True  # 允许携带cookie

# DRF扩展
REST_FRAMEWORK_EXTENSIONS = {
    'DEFAULT_CACHE_RESPONSE_TIMEOUT': 60 * 60,  # 缓存时间
    'DEFAULT_USE_CACHE': 'default',  # 缓存存储
}

# django文件存储
DEFAULT_FILE_STORAGE = 'utils.fastdfs.fdfs_storage.FastDFSStorage'

# 静态文件目录
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static'), ]

# MEDIA_URL = '/media/'
# MEDIA_ROOT = (os.path.join(
#     os.path.dirname(
#         os.path.dirname(
#             os.path.dirname(
#                 os.path.dirname(
#                     os.path.dirname(
#                         os.path.dirname(BASE_DIR)
#                     )
#                 )
#             )
#         )
#     ), 'media/sf_Y_DRIVE/Database/Audio/'))
# print(MEDIA_ROOT)


# 用户认证 ==> JWT
JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=1),  # 指明token的有效期
    'JWT_RESPONSE_PAYLOAD_HANDLER': 'users.utils.jwt_response_payload_handler',  # 指定使用的JWT返回的函数
}

# 配置自定义认证模型类
AUTH_USER_MODEL = 'users.User'  # 指明使用自定义的用户模型类
AUTHENTICATION_BACKENDS = [
    'users.utils.UsernameMobileAuthBackend',  # JWT用户认证登录
    'django.contrib.auth.backends.ModelBackend'  # Admin用户登录
]

# 配置用户登录链接
LOGIN_URL = '/login/'  # 这个路径需要根据你网站的实际登陆地址来设置

XADMIN_TITLE = "EPGN_INFO 后台管理"  # 左上方的文字
XADMIN_FOOTER_TITLE = "small.spider.p@gmail.com"  # 最下面的文字

# 配置全局`文件`路径
CHANNEL_LIST = ["VR", "VL", "HR", "HL", "vorn rechits", "vorn links", "hinten rechits", "hinten links"]

FILE_HEAD_PATH = "/home/zheng/Documents/WorkFile/H_HDF/"
FILE_READ_PATH = "/home/zheng/Documents/WorkFile/R_HDF/"
AUDIO_FILE_PATH = "/home/zheng/Documents/WorkFile/Audio/"

# FILE_HEAD_PATH = "/media/sf_Y_DRIVE/Database/H_HDF/"    # 文件上传的路径
# FILE_READ_PATH = "/media/sf_Y_DRIVE/Database/R_HDF/"    # 可读HDF文件路径
# AUDIO_FILE_PATH = "/media/sf_Y_DRIVE/Database/Audio/"   # 抱怨音频文件

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

DEVELOPER_CHOICE = (
    (1, "郑兴涛"),
    (2, "吴斌")
)

ROLE_CHOICE = (
    (1, "R"),
    (2, "S"),
    (3, "M"),
)

CHECK_WORK_INFO = (
    (1, '未审核'),
    (2, '已通过'),
    (3, '未通过')
)

TEST_CATEGORY = (
    (1, '测试'),
    (2, '管理')
)

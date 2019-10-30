import os
import sys
import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, 'apps'))

SECRET_KEY = '&y3!pn!ybfdw84p(9*_vg8gc1ls63dm1-lc74fdl@g$iyt69(#'
DEBUG = True

# 白名单
ALLOWED_HOSTS = ['*', ]

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

    # 注册CORS
    'corsheaders',

    # 注册全文检索
    'haystack',

    # 使用xadmin
    'xadmin',
    'crispy_forms',

    # 注册子应用
    'users.apps.UsersConfig',
    'fileinfo.apps.FileInfoConfig',
    'calculate.apps.CalculateConfig',
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

ROOT_URLCONF = 'epgn_info.epgn_info.urls'

# 模板文件
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',  # Django自带的模板渲染引擎
        'DIRS': [os.path.join(BASE_DIR, 'templates')],  # 配置HTML文件存放目录
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

WSGI_APPLICATION = 'epgn_info.wsgi.application'

# 配置数据库
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': '127.0.0.1',  # 数据库主机
        'PORT': 3306,  # 数据库端口
        'USER': 'root',  # 数据库用户名
        'PASSWORD': 'root',  # 数据库用户密码
        'NAME': 'EPGN_INFO'  # 新建数据库==> 使用xadmin
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

USE_TZ = True

# 配置缓存 ==> 要使用redis的话，要修改配置文件中的访问地址，再重启服务器
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/0",  # 修改redis数据库配置
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    },
    "session": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    },
    'verifications': {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/2",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    },
    "history": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/3",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        }
    },
    'contrast': {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/5",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
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
            'format': '%(levelname)s %(module)s %(lineno)d %(message)s'
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
            'filename': os.path.join(os.path.dirname(BASE_DIR), "logs/epgn_log.log"),  # 日志文件的位置
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
        'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
        'URL': 'http://127.0.0.1:9200/',  # 此处为elasticsearch运行的服务器ip地址，端口号固定为9200
        'INDEX_NAME': 'epgn_info',  # 指定elasticsearch建立的索引库的名称
    },
}

# 当添加、修改、删除数据时，自动生成索引
HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'

# DRF配置
REST_FRAMEWORK = {
    # 异常处理
    'EXCEPTION_HANDLER': 'epgn_info.utils.exceptions.exception_handler',
    # 认证方式
    # rest_framework.request.WrappedAttributeError: 'CSRFCheck' object has no attribute 'process_request'
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    # 分页
    'DEFAULT_PAGINATION_CLASS': 'epgn_info.epgn_info.utils.pagination.StandardResultsSetPagination',
}

# CORS
CORS_ORIGIN_WHITELIST = (
    'https://127.0.0.1:8000',
    'https://localhost:8000',
)
CORS_ALLOW_CREDENTIALS = True  # 允许携带cookie

# DRF扩展
REST_FRAMEWORK_EXTENSIONS = {
    'DEFAULT_CACHE_RESPONSE_TIMEOUT': 60 * 60,  # 缓存时间
    'DEFAULT_USE_CACHE': 'default',  # 缓存存储
}

# django文件存储
DEFAULT_FILE_STORAGE = 'epgn_info.epgn_info.utils.fastdfs.fdfs_storage.FastDFSStorage'

# 静态文件目录
STATIC_URL = '/epgn_front_end/'
STATICFILES_DIRS = [os.path.join(os.path.dirname(os.path.dirname(BASE_DIR)), 'epgn_front_end'), ]

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
FileSavePath = '/home/spider/Music/大众/EPGN_INGO/'
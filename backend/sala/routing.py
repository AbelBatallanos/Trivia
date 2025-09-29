from django.urls import re_path
from sala.consumers.SalaConsumer import SalaConsumer

websocket_urlpatterns = [
    re_path(r'ws/sala/(?P<codigoUnico>\w+)/$', SalaConsumer.as_asgi()),
]

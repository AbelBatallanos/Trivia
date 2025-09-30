# En backend/triviaApp/routing.py

from channels.routing import URLRouter
from sala.consumers import SalaConsumer 
from django.urls import path 
# ❌ ELIMINAR CUALQUIER OTRA COSA COMO: application = ProtocolTypeRouter(...)

# Esta es la única definición necesaria en este archivo:
websocket_urlpatterns = [
    path('ws/trivia/sala/<str:codigo_sala>/', SalaConsumer.as_asgi()),
]
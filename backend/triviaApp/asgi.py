# En backend/triviaApp/asgi.py

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

# Importaciones requeridas para el middleware.
# K - Estas deben importarse SÓLO después de get_asgi_application()
# from triviaApp.token_auth_middleware import TokenAuthMiddlewareStack 


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'triviaApp.settings')

# 1. ESTO INICIALIZA DJANGO (django.setup()) y carga el registro de Apps/Modelos.
django_asgi_app = get_asgi_application() 

# K - ROMPER EL BUCLE: Importar las rutas AHORA que Django está inicializado.
import triviaApp.routing 
from triviaApp.token_auth_middleware import TokenAuthMiddlewareStack # <-- Importación SEGURA


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": TokenAuthMiddlewareStack( 
            URLRouter(
                triviaApp.routing.websocket_urlpatterns
            )
        ),
    }
)











# # En backend/triviaApp/asgi.py

# import os
# from django.core.asgi import get_asgi_application

# # K - Importación de ProtocolTypeRouter (Necesario para la línea 27)
# from channels.routing import ProtocolTypeRouter, URLRouter 
# # K - Importación de Middlewares (segura)
# from triviaApp.token_auth_middleware import TokenAuthMiddlewareStack 

# # Importar el routing file (solo lo definimos aquí)
# import triviaApp.routing 

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'triviaApp.settings')

# # 1. Inicializa Django (App Registry)
# django_asgi_app = get_asgi_application() 

# # K - Usamos el TokenAuthMiddlewareStack con el ProtocolTypeRouter
# application = ProtocolTypeRouter(
#     {
#         "http": django_asgi_app,
#         "websocket": TokenAuthMiddlewareStack( 
#             URLRouter(
#                 triviaApp.routing.websocket_urlpatterns
#             )
#         ),
#     }
# )
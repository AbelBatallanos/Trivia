# En backend/triviaApp/token_auth_middleware.py

from channels.auth import AuthMiddlewareStack
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.apps import apps # <-- Única importación segura

@database_sync_to_async
def get_user_from_token(token_key):
    # Carga el modelo aquí
    Token = apps.get_model('authtoken', 'Token')
    
    try:
        token = Token.objects.get(key=token_key)
        return token.user
    except Token.DoesNotExist:
        return None 

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # K - Importación requerida para AnonymousUser justo aquí
        from django.contrib.auth.models import AnonymousUser 
        
        query_string = parse_qs(scope["query_string"].decode())
        token_key = query_string.get("token", [None])[0]

        if token_key:
            user = await get_user_from_token(token_key)
            scope["user"] = user if user else AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
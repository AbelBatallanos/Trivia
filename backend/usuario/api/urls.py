from django.urls import path
from usuario.api.views import UsuarioListAV, UsuarioDetalleAV



urlpatterns = [
    #   url ||     nombe funcion   ||     nombre que mntiene referencia a esta url ayuda la flexibilidad
    path('', UsuarioListAV.as_view(), name="indexUsuario"),
    path('<int:id>', UsuarioDetalleAV.as_view(), name="showUsuario"),
    
    
    
]

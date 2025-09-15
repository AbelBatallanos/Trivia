from django.urls import path
from usuario.api.views import  RegistroUsuarioAV, LoginUsuarioAV, LogoutUsuarioAV



urlpatterns = [
    #   url ||     nombe funcion   ||     nombre que mntiene referencia a esta url ayuda la flexibilidad
    # path('', UsuarioListAV.as_view(), name="indexUsuario"),
    # path('<int:id>', UsuarioDetalleAV.as_view(), name="showUsuario"),
    
    # path('login/', UsuarioDetalleAV.as_view(), name="showUsuario"), # solo agregamos el 'rest_framework.authtoken', y importamos la tabla de tockens
    # path('register/', UsuarioDetalleAV.as_view(), name="showUsuario"),
    
    
    path('login/usuario', LoginUsuarioAV.as_view(), name="loginUser" ),
    path('register/usuario', RegistroUsuarioAV.as_view(), name="registerUser" ),
    path('logout/usuario', LogoutUsuarioAV.as_view(), name="logoutUser"),
]

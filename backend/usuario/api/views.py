#Est carpeta actua como el controlador muy diferente  laravel
from django.contrib.auth.hashers import check_password
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from usuario.models import Usuario  #Import la tabla 
# from usuario.api.serializers import UsuarioSerializer

from rest_framework import status
from rest_framework.views import APIView

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

# Create your views here.
# @api_view() este es el decorador, si lo dejamos asi , por defecto viene ser metodo Get



class RegistroUsuarioAV(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        datos = request.data
        user = User.objects.create_user(
            username=datos['username'],
            email=datos['correo'],
            password=datos['password'],
            first_name=datos['nombre'],
            last_name=datos['apellidos'],
        )
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'usuario': user.username,
            'token': token.key
        })

class LoginUsuarioAV(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response({'error': 'Credenciales inválidas'}, status=400)


# class UsuarioLogin(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
#         try:
#             usuario = Usuario.objects.get(username=username)
#         except Usuario.DoesNotExist:
#             return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

#         if check_password(password, usuario.password):
#             token, _ = Token.objects.get_or_create(user=usuario)
#             return Response({'token': token.key})
#         else:
#             return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutUsuarioAV(APIView):
    def post(self, request):
        try:
            request.user.auth_token.delete()
        except:
            return Response({'error': 'Token no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'mensaje': 'Sesión cerrada correctamente'}, status=status.HTTP_200_OK)

  
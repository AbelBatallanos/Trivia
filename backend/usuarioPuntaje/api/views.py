from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from usuarioPuntaje.models import UsuarioPuntaje
from usuarioPuntaje.api.serializers import UserPuntajeSerializer



class ListarUserPoints(APIView):
    def get(self, request, id_sala):
        userPoints = UsuarioPuntaje.objects.filter(sala_id=id_sala)
        if not userPoints.exists():
            return Response(
                {"error": "No se encontró ningún puntaje para esta sala"},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(UserPuntajeSerializer(userPoints, many=True).data)


class CrearUserPoints(APIView):
    def post(self, request, id_sala):
        usuario = request.user  #autenticación
        sala_id = id_sala

        # Verificar si ya existe el registro
        if UsuarioPuntaje.objects.filter(usuario=usuario, sala_id=sala_id).exists():
            return Response(
                {"error": "Ya existe un registro para este usuario en esta sala"},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = {
            "usuario": usuario.id,
            "sala": sala_id,
            "puntaje": 0,
            "aciertos": 0,
            "fallos": 0
        }

        serializer = UserPuntajeSerializer(data=data)
        if serializer.is_valid():
            userPoint = serializer.save()
            return Response(UserPuntajeSerializer(userPoint).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


    
        
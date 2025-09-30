from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from usuarioPuntaje.models import UsuarioPuntaje
from sala.models import Sala
from usuarioPuntaje.api.serializers import UserPuntajeSerializer
from rest_framework.permissions import AllowAny


class ListarUserPoints(APIView):
    permission_classes = [AllowAny] 
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
        print("DATOS USER :", request.user)
        print("DATOS USER AHORA SU ID: ", request.user.id)
        usuario = request.user  #autenticación

        try:
            sala = Sala.objects.get(pk=id_sala)
        except Sala.DoesNotExist:
            return Response({"error": "La Sala No Existe"}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si ya existe el registro
        if UsuarioPuntaje.objects.filter(usuario=usuario, sala_id=id_sala).exists():
            return Response(
                {"error": "Ya existe este usuario en esta sala"},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = {
            "sala": sala.id,
            "puntaje": 0,
            "aciertos": 0,
            "fallos": 0
        }

        serializer = UserPuntajeSerializer(data=data)
        if serializer.is_valid():
            
            userPoint = serializer.save(usuario = request.user) #Asignamos directamente el valor al campo de la tabla 
            return Response(UserPuntajeSerializer(userPoint).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UpdateUserPoints(APIView):
    def put(self, request, id_sala):
        usuario = request.user
        try:
            sala = Sala.objects.get(sala=id_sala)
        except Sala.DoesNotExist:
            return Response({"error":"No se encontro la Sala"}, status=status.HTTP_404_NOT_FOUND)
        try:
            userPoint = UsuarioPuntaje.objects.get(usuario=usuario, sala=sala)
        except UsuarioPuntaje.DoesNotExist:
            return Response({"error":"No se encontro el usuario"}, status=status.HTTP_404_NOT_FOUND)      
              
        acierto = request.data.get("acierto")
        punto = request.data.get("puntos", 0) 
        
        if acierto is True:
            userPoint.puntaje += punto      
            userPoint.aciertos += 1
        elif acierto is False:
            userPoint.fallos += 1
        else:
            return Response({"error": "Debes enviar el campo 'acierto' como true o false"}, status=status.HTTP_400_BAD_REQUEST)
        
        userPoint.save()
        serializer = UserPuntajeSerializer(userPoint)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
        
        
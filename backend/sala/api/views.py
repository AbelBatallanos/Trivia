

from rest_framework.response import Response
from sala.models import Sala
from sala.api.serializers import SalaSerializer
from rest_framework import status
from rest_framework.views import APIView



class CrearSalaCompletaAV(APIView):
    def get(self, request):
        sala = Sala.objects.all()
        serializers = SalaSerializer(sala, many=True)
        return Response(serializers.data)
        
    def post(self, request):
        serializer = SalaSerializer(data=request.data)
        if serializer.is_valid():
            sala = serializer.save()
            return Response(SalaSerializer(sala).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SalaDetailAV(APIView):
    def get(self, request, id):
        try:
            sala = Sala.objects.get(pk=id)
        except Sala.DoesNotExist:
            return Response({'error': 'Sala no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SalaSerializer(sala)
        return Response(serializer.data)

    def put(self, request, id):
        try:
            sala = Sala.objects.get(pk=id)
        except Sala.DoesNotExist:
            return Response({'error': 'Sala no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SalaSerializer(sala, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            sala = Sala.objects.get(pk=id)
        except Sala.DoesNotExist:
            return Response({'error': 'Sala no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        sala.delete()
        return Response({'mensaje': 'Sala eliminada'}, status=status.HTTP_204_NO_CONTENT)
          
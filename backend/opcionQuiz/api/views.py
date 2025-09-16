from rest_framework.response import Response
from opcionQuiz.models import OpcionQuiz
from preguntaQuiz.models import PreguntaQuiz
from opcionQuiz.api.serializers import OpcionQuizSerializer
from rest_framework import status
from rest_framework.views import APIView


class listOpcion(APIView):
    def get(self, request):
        opcion = OpcionQuiz.objects.all()
        serializer = OpcionQuizSerializer(opcion, many=True)
        return Response(serializer.data)



class listOpcionsPregunta(APIView):
    def get(self, request, id_pregunta):
        try:
            pregunta = PreguntaQuiz.objects.get(id=id_pregunta)
        except PreguntaQuiz.DoesNotExist:
            return Response({'error': 'Pregunta no encontrada'}, status=404)
        opcion = OpcionQuiz.objects.filter(pregunta_id=pregunta.id)
        
        return Response(OpcionQuizSerializer(opcion, many=True).data, status=status.HTTP_200_OK)
        
        
        
class opcionDelete(APIView):
    def delete(self, request, id_pregunta, id_opcion):
        try:
            opcion = OpcionQuiz.objects.get(id=id_opcion, pregunta=id_pregunta)
        except OpcionQuiz.DoesNotExist:
            return Response({'error': 'Pregunta no encontrada'}, status=404)
        
        opcion.delete()
        return Response({'mensaje': 'Pregunta eliminada'}, status=204)
    
    
    
class opcionUpdate(APIView):
    def put(self, request, id_pregunta, id_opcion):
        try:
            opcion = OpcionQuiz.objects.get(id=id_opcion, pregunta_id=id_pregunta)
        except OpcionQuiz.DoesNotExist:
            return Response({"Error": "No se encontro la respuesta"}, status=404)
        
        serializer = OpcionQuizSerializer(opcion, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response()
        return Response(serializer.errors, status=400)
    
    
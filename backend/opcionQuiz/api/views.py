from rest_framework.response import Response
from opcionQuiz.models import OpcionQuiz
from opcionQuiz.api.serializers import OpcionQuizSerializer
from rest_framework import status
from rest_framework.views import APIView





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
    
    
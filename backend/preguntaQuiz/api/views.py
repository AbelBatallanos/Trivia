from rest_framework.response import Response
from preguntaQuiz.models import PreguntaQuiz
from sala.models import Sala
from preguntaQuiz.api.serializers import PreguntaQuizSerializer
from rest_framework import status
from rest_framework.views import APIView




class listPregunta(APIView):
    def get(self, request):
        preguntas = PreguntaQuiz.objects.all()
        serializer = PreguntaQuizSerializer(preguntas, many=True)
        return Response(serializer.data)

class CrearPreguntaEnSalaAV(APIView):
    def post(self, request, id_sala):
        # try:
        sala = Sala.objects.get(id=id_sala)
        # except Sala.DoesNotExist:
        #     return Response({'error': 'Sala no encontrada'}, status=404)

        # if sala.creador != request.user:
        #     return Response({'error': 'No tienes permiso para agregar preguntas'}, status=403)

        serializer = PreguntaQuizSerializer(data=request.data)
        if serializer.is_valid():
            pregunta = serializer.save(sala=sala)
            return Response(PreguntaQuizSerializer(pregunta).data, status=201)
        return Response(serializer.errors, status=400)



class UpdatePregunta(APIView):
    def put(self, request, id_sala, id_pregunta):
        # try:
        #     sala = Sala.objects.get(id=id_sala)
        # except Sala.DoesNotExist:
        #     return Response({'error': 'Sala no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        # if sala.creador != request.user:
        #     return Response({'error': 'No tienes permiso para modificar esta sala'}, status=status.HTTP_403_FORBIDDEN)
        try:
            sala = Sala.objects.get(id=id_sala)
            pregunta = PreguntaQuiz.objects.get(id=id_pregunta, sala=sala)
        except PreguntaQuiz.DoesNotExist:
            return Response({'error': 'Pregunta no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PreguntaQuizSerializer(pregunta, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeletePregunta(APIView):
    def delete(self, request, id_sala, id_pregunta):
        # try:
        #     sala = Sala.objects.get(id=id_sala)
        # except Sala.DoesNotExist:
        #     return Response({'error': 'Sala no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        # if sala.creador != request.user:
        #     return Response({'error': 'No tienes permiso para eliminar esta pregunta'}, status=status.HTTP_403_FORBIDDEN)

        try:
            sala = Sala.objects.get(id=id_sala)
            pregunta = PreguntaQuiz.objects.get(id=id_pregunta, sala=sala)
        except PreguntaQuiz.DoesNotExist:
            return Response({'error': 'Pregunta no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        pregunta.delete()
        return Response({'mensaje': 'Pregunta eliminada'}, status=status.HTTP_204_NO_CONTENT)





# class StorePregunta(APIView):  #DESDE AQUI LO CONSTRUI
#     def post(self, request, ):
    



# class UpdatePregunta(APIView):  # Para update 
#     def put(self, request, id_sala, id_pregunta):
#         try:
#             pregunta = PreguntaQuiz.objects.get(id=id_pregunta, id= id_sala)
#         except PreguntaQuiz.DoesNotExist:
#             return Response({'error': 'pregunta no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
#         serializer = PreguntaQuizSerializer(pregunta ,data=request.data, partial=True)
#         if serializer.is_valid():
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
  
    
# class DeletePregunta(APIView):
#     def delete(self, request, id_sala, id_pregunta):
#         try:
#             pregunta = PreguntaQuiz.objects.get(id=id_pregunta, id= id_sala)
#         except PreguntaQuiz.DoesNotExist:
#             return Response({'error': 'pregunta no encontrada'}, status=status.HTTP_200)
        
#         pregunta.delete()
#         return Response({'mensaje': 'pregunta eliminada'}, status=status.HTTP_204_NO_CONTENT)


        
        
        
        
        
    
# class preguntaCompletaAV(APIView):  #Class Listar , Crear
#     def get(self, request):
#         pregunta = PreguntaQuiz.objects.all()
#         serializers = PreguntaQuizSerializer(pregunta, many=True)
#         return Response(serializers.data)
        
#     def post(self, request):
#         serializer = PreguntaQuizSerializer(data=request.data)
#         if serializer.is_valid():
#             pregunta = serializer.save()
#             return Response(PreguntaQuizSerializer(pregunta).data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class preguntaDetailAV(APIView): #Class Mostrar, Actualizar, Eliminar
#     def get(self, request, id):
#         try:
#             pregunta = PreguntaQuiz.objects.get(pk=id)
#         except PreguntaQuiz.DoesNotExist:
#             return Response({'error': 'pregunta no encontrada'}, status=status.HTTP_404_NOT_FOUND)

#         serializer = PreguntaQuizSerializer(pregunta)
#         return Response(serializer.data)

#     def put(self, request, id):
#         try:
#             pregunta = PreguntaQuiz.objects.get(pk=id)
#         except PreguntaQuiz.DoesNotExist:
#             return Response({'error': 'pregunta no encontrada'}, status=status.HTTP_404_NOT_FOUND)

#         serializer = PreguntaQuizSerializer(pregunta, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, id):
#         try:
#             pregunta = PreguntaQuiz.objects.get(pk=id)
#         except PreguntaQuiz.DoesNotExist:
#             return Response({'error': 'pregunta no encontrada'}, status=status.HTTP_404_NOT_FOUND)

#         pregunta.delete()
#         return Response({'mensaje': 'pregunta eliminada'}, status=status.HTTP_204_NO_CONTENT)
          
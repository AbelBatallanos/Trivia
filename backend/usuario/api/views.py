#Est carpeta actua como el controlador muy diferente  laravel


from rest_framework.response import Response
from usuario.models import Usuario  #Import la tabla 
from usuario.api.serializers import UsuarioSerializer
# from rest_framework.decorators import api_view   # Antigua forma de especificar los metodos 
from rest_framework import status
from rest_framework.views import APIView


# Create your views here.
# @api_view() este es el decorador, si lo dejamos asi , por defecto viene ser metodo Get


class UsuarioListAV(APIView):
    def get(self, request):
        usuario = Usuario.objects.all()
        serialize = UsuarioSerializer(usuario, many=True)
        return Response(serialize.data)
        
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
class UsuarioDetalleAV(APIView): 
        def get(self, request, id): # Show
            try:
               usuario = Usuario.objects.get(pk=id)
            except Usuario.DoesNotExist:
                return Response( {"Error": "No se encontro el usuario"}, status=status.HTTP_404_NOT_FOUND)
            serializer = UsuarioSerializer(usuario)
            return Response(serializer.data)
        
        
        def put(self ,request, id):#actualizar datos usuarios 
            try:
               usuario = Usuario.objects.get(pk= id)
            except Usuario.DoesNotExist:
                return Response({"Error": "No se encontro el usuario"},status=status.HTTP_404_NOT_FOUND)
            
            serializer = UsuarioSerializer(usuario ,data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
          
                      
        def delete(self, id): #
            try:
               usuario = Usuario.objects.get(pk= id)
            except Usuario.DoesNotExist:
                return Response({"Error": "No se encontro el inmueble"},status=status.HTTP_404_NOT_FOUND)
            usuario.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
            
         
                
        
        
        



















          
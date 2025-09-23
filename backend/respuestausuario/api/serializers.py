from rest_framework import serializers
from respuestausuario.models import RespuestaUsuario



class RespuestaUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = RespuestaUsuario
        fields = ['id', 'sala', 'pregunta', 'es_correcta', 'fecha_respuesta']
        read_only_fields = ['fecha_respuesta']



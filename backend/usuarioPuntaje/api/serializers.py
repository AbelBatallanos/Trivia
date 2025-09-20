from rest_framework import serializers
from usuarioPuntaje.models import UsuarioPuntaje # Asegúrate de que el nombre del modelo esté bien escrito
  

class UserPuntajeSerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.CharField(source='usuario.username', read_only=True)
    class Meta:
        model = UsuarioPuntaje
        fields = ['id', 'nombre_usuario', 'puntaje', 'aciertos', 'fallos'] #fields: define los campos que quieres exponer en la API.
        read_only_fields = ['puntaje', 'aciertos', 'fallos']  # Si solo se crean en 0 y luego se actualizan  #read_only_fields: útil si no quieres que el frontend modifique directamente

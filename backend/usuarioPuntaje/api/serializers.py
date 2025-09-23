from rest_framework import serializers
from usuarioPuntaje.models import UsuarioPuntaje # Asegúrate de que el nombre del modelo esté bien escrito
  

class UserPuntajeSerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.CharField(source='usuario.username', read_only=True)
    class Meta:
        model = UsuarioPuntaje
        fields = ['id', 'nombre_usuario', 'sala', 'puntaje', 'aciertos', 'fallos'] #fields: define los campos que quieres exponer en la API.
        read_only_fields = ['puntaje', 'aciertos', 'fallos']  # Si solo se crean en 0 y luego se actualizan      
        #   read_only_fields: útil si no quieres que el frontend modifique directamente


    # def update(self, instance, validated_data):
    #     # Actualiza solo los campos que vienen en el request
    #     instance.puntaje = validated_data.get('puntaje', instance.puntaje)
    #     instance.aciertos = validated_data.get('aciertos', instance.aciertos)
    #     instance.fallos = validated_data.get('fallos', instance.fallos)
    #     instance.save()
    #     return instance
        

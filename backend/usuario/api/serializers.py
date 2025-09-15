from rest_framework import serializers
from usuario.models import Usuario
from django.contrib.auth.hashers import make_password



class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = "__all__"  # Esto hace un mapeo de todas nuestros atrributos de la bd    
        # fields = ["id", "pais", "active", "imagen"]  #Solo mostrara los atributos que estn aqui
        # exclude = ['id'] # Excluye los campos referenciados aqui
        
    def validate(self, data):
        if data['nombre'] == data['apellidos']:
            raise serializers.ValidationError("Nombre y Apellidos deben ser diferentes")
        else:
            return data
        
    # def validate_imagen(self, data):  #el validate es el standar ya que esta predefinido en el framework;  ahora _imagen esto es hacer referenci a uno de los elementos de la entidad 
    #     if len(data) < 2:
    #         raise serializers.ValidationError("El valor es muy corta")
    #     else:
    #         return data

  

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)





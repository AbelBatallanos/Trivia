from rest_framework import serializers
from preguntaQuiz.models import PreguntaQuiz
from opcionQuiz.models import OpcionQuiz
from opcionQuiz.api.serializers import OpcionQuizSerializer

class PreguntaQuizSerializer(serializers.ModelSerializer):
    opciones = OpcionQuizSerializer(many=True)

    class Meta:
        model = PreguntaQuiz
        fields = ['id', 'pregunta', 'orden', 'tiempo_limite', 'sala_id' ,'fechaCreada', 'update', 'opciones']
        read_only_fields = ['orden']

    def validate(self, data):
        opciones = data.get('opciones')
        if data['tiempo_limite'] < 5 or data['tiempo_limite'] > 10 :
            raise serializers.ValidationError({"tiempo_limite": "Debe ser al menos 5 o maximo 10 segundos" })   
           
        if opciones is None:
            raise serializers.ValidationError({"opciones": "Debes agregar las opciones."})

        if not isinstance(opciones, list):
            raise serializers.ValidationError({"opciones": "El campo opciones debe ser una lista."})

        if not (2 <= len(opciones) <= 4):
            raise serializers.ValidationError({"opciones": "Cada pregunta debe tener entre 2 y 4 opciones."})

        correctas = [op for op in opciones if op.get('es_correcta')]
        if len(correctas) != 1:
            raise serializers.ValidationError({"opciones": "Debe haber exactamente una opción correcta."})

        return data

    
    def create(self, validated_data):
        opciones_data = validated_data.pop('opciones')
        pregunta = PreguntaQuiz.objects.create(**validated_data)

        for opcion_data in opciones_data:
            OpcionQuiz.objects.create(pregunta=pregunta, **opcion_data)

        return pregunta


    def update(self, instance, validated_data):
        opciones_data = validated_data.pop('opciones', None) #Extrae la lista de opciones 

        # Actualizar campos simples
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if opciones_data is not None:
            for opcion_data in opciones_data:
                opcion_id = opcion_data.get('id')
                if opcion_id:
                    try:
                        opcion = OpcionQuiz.objects.get(id=opcion_id, pregunta=instance)
                        for attr, value in opcion_data.items():
                            if attr != 'id':
                                setattr(opcion, attr, value)
                        opcion.save()
                    except OpcionQuiz.DoesNotExist:
                        continue  # O registrar error
                else:
                    OpcionQuiz.objects.create(pregunta=instance, **opcion_data)

        return instance


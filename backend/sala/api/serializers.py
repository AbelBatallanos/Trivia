from rest_framework import serializers
from sala.models import Sala
from preguntaQuiz.models import PreguntaQuiz
from opcionQuiz.models import OpcionQuiz
from preguntaQuiz.api.serializers import PreguntaQuizSerializer


class SalaSerializer(serializers.ModelSerializer):
    preguntas = PreguntaQuizSerializer(many=True)

    class Meta:
        model = Sala
        fields = ['id', 'titulo', 'capacidad', 'creador_id', 'codigoUnico', 'preguntas' ]
        read_only_fields = ['codigoUnico', 'creador_id']
        
        
    def validate(self, data):
        # Validación 1: capacidad > 0
        if data.get('capacidad', 0) <= 0:
            raise serializers.ValidationError("La capacidad de la sala debe ser mayor a cero.")

        # Validación 2 y 3: preguntas con al menos 2 opciones y solo una correcta
        preguntas = data.get('preguntas', [])
        if len(preguntas) < 1:
                raise serializers.ValidationError("Debe de Haber minimo 1 pregunta")
            
        for i, pregunta in enumerate(preguntas):
            opciones = pregunta.get('opciones', [])
            if len(opciones) <= 1:
                raise serializers.ValidationError(f"La pregunta #{i+1} debe tener al menos 2 opciones.")

            correctas = [op for op in opciones if op.get('es_correcta')]
            if len(correctas) != 1:
                raise serializers.ValidationError(f"La pregunta #{i+1} debe tener exactamente 1 opción correcta.")

        return data        


    def create(self, validated_data):
        preguntas_data = validated_data.pop('preguntas')
        
        # Asignar el creador desde el contexto (por ejemplo, request.user)
        creador = self.context['request'].user
        sala = Sala.objects.create(creador=creador, **validated_data)

        for pregunta_data in preguntas_data:
            opciones_data = pregunta_data.pop('opciones')
            pregunta = PreguntaQuiz.objects.create(sala=sala, **pregunta_data)
            for opcion_data in opciones_data:
                OpcionQuiz.objects.create(pregunta=pregunta, **opcion_data)

        return sala


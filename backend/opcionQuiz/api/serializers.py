from rest_framework import serializers
from opcionQuiz.models import OpcionQuiz

class OpcionQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpcionQuiz
        fields = ['id', 'pregunta_id', 'descripcion', 'es_correcta', 'puntaje']

    def validate(self, data): # Esta parte se ejecuta cuando usamos   .is_valid() 
        
        if data['puntaje'] <= 0 and data["es_correcta"] == True:
            raise serializers.ValidationError({"puntaje": "El puntaje debe de ser mayor a 0"})
        
        return data








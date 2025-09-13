from rest_framework import serializers
from opcionQuiz.models import OpcionQuiz

class OpcionQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpcionQuiz
        fields = ['id', 'descripcion', 'es_correcta', 'puntaje']

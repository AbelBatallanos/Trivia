from django.db import models
from preguntaQuiz.models import PreguntaQuiz


class OpcionQuiz(models.Model):
    pregunta = models.ForeignKey(PreguntaQuiz, on_delete=models.CASCADE, related_name='opciones')
    descripcion = models.CharField(max_length=200)
    es_correcta = models.BooleanField(default=False)
    puntaje = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Opción: {self.descripcion} ({'Correcta' if self.es_correcta else 'Incorrecta'})"

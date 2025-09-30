from django.db import models
from django.contrib.auth.models import User 
from sala.models import Sala
from preguntaQuiz.models import PreguntaQuiz

class RespuestaUsuario(models.Model):
    
    usuario = models.ForeignKey( 
        User,
        on_delete=models.CASCADE,
        related_name='respuestas'
    )
    
    sala = models.ForeignKey(
        Sala, 
        on_delete=models.CASCADE
    )
    
    pregunta = models.ForeignKey(PreguntaQuiz, on_delete=models.CASCADE)
    es_correcta = models.BooleanField()
    fecha_respuesta = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('usuario', 'pregunta'),)
from django.db import models
from sala.models import Sala


class PreguntaQuiz(models.Model):
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE, related_name='preguntas')
    pregunta = models.TextField()
    orden = models.PositiveIntegerField()
    tiempo_limite = models.PositiveIntegerField(default=30)  # segundos
    fechaCreada = models.DateTimeField(auto_now_add=True)
    update = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.orden:
            max_orden = PreguntaQuiz.objects.filter(sala=self.sala).aggregate(models.Max('orden'))['orden__max'] or 0
            self.orden = max_orden + 1
        super().save(*args, **kwargs)



    def __str__(self):
        return f"Pregunta {self.orden} en sala {self.sala.codigoUnico}"

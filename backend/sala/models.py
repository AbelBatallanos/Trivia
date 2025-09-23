import uuid
from django.db import models
from django.contrib.auth.models import User


class Sala(models.Model):
    titulo = models.CharField(max_length=100)
    capacidad = models.PositiveIntegerField()
    creador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='salas')
    codigoUnico = models.CharField(max_length=8, unique=True, editable=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.codigoUnico:
            self.codigoUnico = uuid.uuid4().hex[:8].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.titulo} ({self.codigoUnico})"

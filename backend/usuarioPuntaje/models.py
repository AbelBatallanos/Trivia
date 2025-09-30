from django.db import models
from sala.models import Sala
from django.contrib.auth.models import User
from django.conf import settings 


class UsuarioPuntaje(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='puntajes')
    sala = models.ForeignKey(Sala, on_delete=models.CASCADE, related_name='puntajes')
    puntaje = models.IntegerField(default=0)
    # usuario = models.ForeignKey(
    #     User,
    #     on_delete=models.CASCADE,
        
    # )
    # sala = models.ForeignKey(
    #     Sala,
    #     on_delete=models.CASCADE,
        
    # )
    # puntaje = models.IntegerField(default=0)
    fallos = models.IntegerField(default=0)
    aciertos = models.IntegerField(default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    ultima_actualizacion = models.DateTimeField(auto_now=True)

    nickname = models.CharField(max_length=12, blank=True, null=True) 


    class Meta:
        unique_together = ('usuario', 'sala')  # Evita duplicados por usuario-sala
        verbose_name = 'Puntaje de Usuario'
        verbose_name_plural = 'Puntajes de Usuarios'


    def __str__(self):
        nickname_display = self.nickname or self.usuario.username 
        return f"{self.nickname_display} en sala '{self.sala.titulo}' → Puntaje: {self.puntaje}"

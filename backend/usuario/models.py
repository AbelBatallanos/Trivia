# from django.db import models

# # Create your models here.

# class Usuario(models.Model):
#     nombre = models.CharField(max_length=250)      # Texto corto (string)
#     apellidos = models.CharField(max_length=150)
#     username = models.CharField(max_length=150, unique=True)  # Campo único
#     correo = models.EmailField(max_length=255, unique=True)   # EmailField ya valida correos
#     password = models.CharField(max_length=128)    # Longitud suficiente para contraseñas cifradas

#     def __str__(self):
#         return f"{self.nombre} {self.apellidos}"

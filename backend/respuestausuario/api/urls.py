from django.urls import path
from respuestausuario.api.views import RegistrarRespuestaView


urlpatterns = [
    path("sala/<int:id_sala>/pregunta/<int:id_pregunta>/create/", RegistrarRespuestaView.as_view(), name="registrar-respuesta")

]


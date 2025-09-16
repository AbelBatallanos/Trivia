from django.urls import path
from preguntaQuiz.api.views import UpdatePregunta, DeletePregunta, CrearPreguntaEnSalaAV, listPregunta, listPreguntaSala
urlpatterns = [
    path('pregunta/listar/', listPregunta.as_view(), name="listar-pregunta"),

    path('sala/<int:id_sala>/pregunta/listar/', listPreguntaSala.as_view(), name="listar-pregunta-de-la-sala"),

    path('sala/<int:id_sala>/pregunta/', CrearPreguntaEnSalaAV.as_view(), name="crear-pregunta"),
    
    path('sala/<int:id_sala>/pregunta/<int:id_pregunta>/update/', UpdatePregunta.as_view(), name="update-pregunta"),
    
    path('sala/<int:id_sala>/pregunta/<int:id_pregunta>/delete/', DeletePregunta.as_view(), name="delete-pregunta"),
]

  
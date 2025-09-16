from django.urls import path
from opcionQuiz.api.views import  listOpcion, listOpcionsPregunta, opcionUpdate, opcionDelete

urlpatterns = [
    path('opcion/listar/', listOpcion.as_view(), name="listar-opcion"),
    
    path('pregunta/<int:id_pregunta>/opcion/listar/', listOpcionsPregunta.as_view(), name="update-opcion"),
    
    path('pregunta/<int:id_pregunta>/opcion/<int:id_opcion>/update/', opcionUpdate.as_view(), name="update-opcion"),
    
    path('pregunta/<int:id_pregunta>/opcion/<int:id_opcion>/delete/', opcionDelete.as_view(), name="delete-opcion"),




]





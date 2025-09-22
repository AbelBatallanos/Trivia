from django.urls import path
from sala.api.views import CrearSalaCompletaAV, SalaDetailAV, ListarmySalas, SalaPorCodigoAV

urlpatterns = [
    
    path('', CrearSalaCompletaAV.as_view(), name="crear-sala"),
    path('showMysalas/', ListarmySalas.as_view(), name="mis-salas"),
    path('<int:id>', SalaDetailAV.as_view(), name="SPD-sala"),
    
     path('join/<str:codigo_unico>/', SalaPorCodigoAV.as_view(), name="sala-por-codigo"),    
    
]

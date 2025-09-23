from django.urls import path
from sala.api.views import CrearSalaCompletaAV, SalaDetailAV, ListarmySalas, ShowCodigoSala

urlpatterns = [
    
    path('', CrearSalaCompletaAV.as_view(), name="crear-sala"),
    path('<int:id>/', SalaDetailAV.as_view(), name="SPD-sala"),
    path('showMysalas/', ListarmySalas.as_view(), name="showmy-sala"),
    path('showByCodeSala/<str:codigounico>/', ShowCodigoSala.as_view(), name="showcode-sala"),
    
]

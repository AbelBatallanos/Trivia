from django.urls import path
from usuarioPuntaje.api.views import ListarUserPoints, CrearUserPoints


urlpatterns = [
    
    path('sala/<int:id_sala>/showDetalles/', ListarUserPoints.as_view(), name="mostrar-clasificacion"),
    path('sala/<int:id_sala>/userPoints/create/', CrearUserPoints.as_view(), name="crear-UserPoint"),
 
]

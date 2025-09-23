from django.urls import path
from usuarioPuntaje.api.views import ListarUserPoints, CrearUserPoints, UpdateUserPoints


urlpatterns = [
    
    path('sala/<int:id_sala>/showDetalles/', ListarUserPoints.as_view(), name="mostrar-clasificacion"),
    path('sala/<int:id_sala>/userPoints/create/', CrearUserPoints.as_view(), name="crear-UserPoint"),
    # path('sala/<int:id_sala>/userPoints/update/', UpdateUserPoints.as_view(), name="update-UserPoint"),  #Actualiza por repuesta 
 
]

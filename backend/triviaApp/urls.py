"""
URL configuration for triviaApp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('trivia/account/', include("usuario.api.urls")),
    path('trivia/sala/', include("sala.api.urls")),

    path('trivia/game/', include("preguntaQuiz.api.urls")),
    path('trivia/game/', include("opcionQuiz.api.urls")),
       
    # path('trivia/dataPoints/', include("usuarioPuntaje.api.urls")),
    # path('trivia/respuesta/', include("respuestausuario.api.urls")),
    
]



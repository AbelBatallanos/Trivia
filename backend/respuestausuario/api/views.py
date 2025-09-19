from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from preguntaQuiz.models import PreguntaQuiz
from usuarioPuntaje.models import UsuarioPuntaje
from respuestausuario.models import RespuestaUsuario
from respuestausuario.api.serializers import RespuestaUsuarioSerializer


class RegistrarRespuestaView(APIView):
    def post(self, request, id_sala, id_pregunta):
        usuario = request.user
        es_correcta = request.data.get('es_correcta')

        # Validar existencia de pregunta y sala
        try:
            pregunta = PreguntaQuiz.objects.get(id=id_pregunta, sala_id=id_sala)
        except PreguntaQuiz.DoesNotExist:
            return Response({"error": "La pregunta no existe en esta sala"}, status=status.HTTP_404_NOT_FOUND)

        # Crear respuesta
        respuesta = RespuestaUsuario.objects.create(
            usuario=usuario,
            sala_id=id_sala,
            pregunta=pregunta,
            es_correcta=es_correcta
        )

        # Actualizar puntaje
        puntaje = UsuarioPuntaje.objects.get(usuario=usuario, sala_id=id_sala)
        if es_correcta:
            puntaje.aciertos += 1
            puntaje.puntaje += pregunta.valor  # ← valor dinámico
        else:
            puntaje.fallos += 1
        puntaje.save()

        return Response(RespuestaUsuarioSerializer(respuesta).data, status=status.HTTP_201_CREATED)


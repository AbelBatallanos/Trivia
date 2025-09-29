import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

from sala.models import Sala
from preguntaQuiz.models import PreguntaQuiz
from opcionQuiz.models import OpcionQuiz

from usuarioPuntaje.models import UsuarioPuntaje


class SalaConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        # self.codigoUnico = self.scope['url_route']['kwargs']['codigoUnico']  #Extrae el codigoUnico desde la URL del WebSocket.
        # self.room_group_name = f"sala_{self.codigoUnico}" #Define el nombre del grupo de canales para esta sala.  Todos los jugadores conectados a esta sala compartirán este grupo.
        # self.user = self.scope["user"] #Extrae el usuario autenticado desde el contexto del WebSocket.

        # await self.channel_layer.group_add(self.room_group_name, self.channel_name) #Agrega este canal (jugador) al grupo de la sala.  Esto permite enviar mensajes a todos los jugadores de la sala.
        # await self.accept() # Acepta la conexión WebSocket. Sin esto, el cliente no podrá enviar ni recibir mensajes.

        # # Crear UsuarioPuntaje si es jugador autenticado
        # if self.user:  #🔹 Si el usuario está autenticado:  
        #     sala = await self.get_sala() #  Obtiene la sala desde la base de datos.
        #     await self.create_user_puntaje(sala)  # Crea un registro en UsuarioPuntaje para este jugador.


    async def disconnect(self, close_code):  #Se ejecuta automáticamente cuando el cliente se desconecta.
        # await self.channel_layer.group_discard(self.room_group_name, self.channel_name) #Elimina este canal del grupo de la sala.

        # # Eliminar UsuarioPuntaje si se desconecta
        # if self.user.is_authenticated:
        #     sala = await self.get_sala()
        #     await self.delete_user_puntaje(sala)



    # async def get_sala(self):# Obtenemos sala con el codigoUnico Vinculado
    #     return await database_sync_to_async(Sala.objects.get)(codigoUnico=self.codigoUnico)



    # async def create_user_puntaje(self, sala): #Crea el registro a la tabla UsuarioPuntaje
    #     await database_sync_to_async(UsuarioPuntaje.objects.get_or_create)(
    #         usuario=self.user,
    #         sala=sala
    #     )


    # async def delete_user_puntaje(self, sala):
    #     await database_sync_to_async(UsuarioPuntaje.objects.filter(usuario=self.user, sala=sala).delete)()


    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     evento = data.get("evento")

    #     if evento == "respuesta":
    #         await self.procesar_respuesta(data)
    #     elif evento == "comenzar_partida":
    #         await self.iniciar_partida()
    #     # Puedes agregar más eventos aquí



    # async def procesar_respuesta(self, data):
    #     pregunta_id = data.get("pregunta_id")
    #     opcion_id = data.get("opcion_id")

    #     pregunta = await database_sync_to_async(PreguntaQuiz.objects.get)(id=pregunta_id)
    #     opcion = await database_sync_to_async(OpcionQuiz.objects.get)(id=opcion_id)
    #     sala = await self.get_sala()
    #     user_puntaje = await database_sync_to_async(UsuarioPuntaje.objects.get)(usuario=self.user, sala=sala)

    #     if opcion.es_correcta:
    #         user_puntaje.aciertos += 1
    #         user_puntaje.puntaje += 120
    #     else:
    #         user_puntaje.fallos += 1

    #     await database_sync_to_async(user_puntaje.save)()

    #     # Enviar resultado al jugador
    #     await self.send(text_data=json.dumps({
    #         "evento": "resultado",
    #         "correcta": opcion.es_correcta,
    #         "puntaje": user_puntaje.puntaje,
    #         "aciertos": user_puntaje.aciertos,
    #         "fallos": user_puntaje.fallos
    #     }))

    #     # Enviar siguiente pregunta a todos
    #     siguiente = await self.get_siguiente_pregunta(pregunta)
    #     await self.channel_layer.group_send(
    #         self.room_group_name,
    #         {
    #             "type": "enviar_pregunta",
    #             "pregunta": siguiente
    #         }
    #     )


    # async def get_siguiente_pregunta(self, pregunta_actual):
    #     sala = await self.get_sala()
    #     siguiente = await database_sync_to_async(
    #         lambda: PreguntaQuiz.objects.filter(
    #             sala=sala,
    #             orden__gt=pregunta_actual.orden
    #         ).order_by('orden').first()
    #     )()

    #     if siguiente:
    #         opciones = await database_sync_to_async(
    #             lambda: list(OpcionQuiz.objects.filter(pregunta=siguiente).values('id', 'descripcion'))
    #         )()

    #         return {
    #             "pregunta_id": siguiente.id,
    #             "orden": siguiente.orden,
    #             "texto": siguiente.pregunta,
    #             "tiempo_limite": siguiente.tiempo_limite,
    #             "opciones": opciones
    #         }
    #     else:
    #         return {
    #             "evento": "fin_partida",
    #             "mensaje": "La partida ha terminado"
    #         }

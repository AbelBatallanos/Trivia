# diegofmdev/trivia-prueba-4/trivia-prueba-4-91bcf1b0dfd47a65c9fbd2abce9e5003b070ba58/backend/sala/consumers.py
import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.apps import apps
from django.db import transaction
import time 

# --- ORM UTILITY FUNCTIONS ---
@database_sync_to_async
def join_sala(sala_code, user, temporary_nickname=None): # Añadir temporary_nickname
    from usuarioPuntaje.models import UsuarioPuntaje # Asegúrate de importar

    try:
        sala = Sala.objects.get(codigo_sala=sala_code)
        
        usuario_puntaje, created = UsuarioPuntaje.objects.get_or_create(
            usuario=user,
            sala=sala,
            defaults={'puntaje': 0}
        )
        
        # Guardar el apodo temporal si se proporciona
        if temporary_nickname:
            usuario_puntaje.nickname = temporary_nickname
            usuario_puntaje.save()
            
        return sala, created
        
    except Sala.DoesNotExist:
        return None, False
        
@database_sync_to_async
def get_current_lobby_players(sala_code):
    """Retorna una lista de jugadores (username y id) en la sala."""
    UsuarioPuntaje = apps.get_model('usuarioPuntaje', 'UsuarioPuntaje')
    Sala = apps.get_model('sala', 'Sala')
    
    try:
        sala = Sala.objects.get(codigoUnico=sala_code)
        
        players_data = list(UsuarioPuntaje.objects.filter(sala=sala)
            .select_related('usuario')
            .values('usuario__username', 'usuario__id'))
        
        return [{'nickname': p['usuario__username'], 'id': p['usuario__id']} for p in players_data]
    except Sala.DoesNotExist:
        return []

@database_sync_to_async
def create_or_get_user_puntaje(user_id, codigo_sala): 
    """Crea o recupera el registro de puntuación inicial."""
    User = apps.get_model('auth', 'User')
    Sala = apps.get_model('sala', 'Sala')
    UsuarioPuntaje = apps.get_model('usuarioPuntaje', 'UsuarioPuntaje')

    try:
        user = User.objects.get(id=user_id)
        sala = Sala.objects.get(codigoUnico=codigo_sala)
    except (User.DoesNotExist, Sala.DoesNotExist):
        return None, False, "Error: Usuario o Sala no encontrados.", None

    user_puntaje, created = UsuarioPuntaje.objects.get_or_create(
        usuario=user, sala=sala, defaults={'puntaje': 0, 'aciertos': 0, 'fallos': 0}
    )
    return user_puntaje, created, f"{user.username} {'creado' if created else 'ya existe'} en la sala.", sala.id 

@database_sync_to_async
def delete_player_puntaje(user_id, sala_code):
    """Elimina el registro de puntaje (jugador) al desconectarse."""
    UsuarioPuntaje = apps.get_model('usuarioPuntaje', 'UsuarioPuntaje')
    Sala = apps.get_model('sala', 'Sala')
    try:
        sala = Sala.objects.get(codigoUnico=sala_code)
        UsuarioPuntaje.objects.filter(usuario_id=user_id, sala=sala).delete()
    except Sala.DoesNotExist:
        pass

@database_sync_to_async
def get_sala_id_by_code(code):
    """Obtiene el ID de la Sala a partir del código único."""
    Sala = apps.get_model('sala', 'Sala') 
    try:
        return Sala.objects.get(codigoUnico=code).id
    except Sala.DoesNotExist:
        return None

@database_sync_to_async
def get_sala_host_id(sala_id):
    """Obtiene el ID del creador de la sala."""
    Sala = apps.get_model('sala', 'Sala')
    try:
        return Sala.objects.values('creador_id').get(id=sala_id)['creador_id']
    except Sala.DoesNotExist:
        return None

@database_sync_to_async
def get_sala_questions(sala_id):
    """Obtiene las preguntas de la sala."""
    PreguntaQuiz = apps.get_model('preguntaQuiz', 'PreguntaQuiz')
    
    try:
        sala = apps.get_model('sala', 'Sala').objects.prefetch_related('preguntas__opciones').get(id=sala_id)
        questions_data = []
        for q in sala.preguntas.all().order_by('orden'):
            options_list = list(q.opciones.all().values('id', 'descripcion')) 
            questions_data.append({
                'id': q.id,
                'pregunta': q.pregunta,
                'tiempo_limite': q.tiempo_limite,
                'opciones': options_list, 
            })
        return questions_data
    except apps.get_model('sala', 'Sala').DoesNotExist:
        return []

@database_sync_to_async
def get_updated_scores(sala_id):
    UsuarioPuntaje = apps.get_model('usuarioPuntaje', 'UsuarioPuntaje')
    return list(UsuarioPuntaje.objects.filter(sala_id=sala_id)
        .order_by('-puntaje')
        .values('usuario__username', 'puntaje', 'aciertos', 'fallos'))

@database_sync_to_async
def get_option_details(question_id, opcion_id):
    """
    Obtiene los detalles de la opción. 
    Si opcion_id es None, solo devuelve la ID de la opción correcta y el tiempo límite.
    """
    PreguntaQuiz = apps.get_model('preguntaQuiz', 'PreguntaQuiz')
    OpcionQuiz = apps.get_model('opcionQuiz', 'OpcionQuiz')
    
    try:
        question = PreguntaQuiz.objects.get(id=question_id)
        
        # 1. Siempre buscar la opción correcta para la revelación
        correct_option = OpcionQuiz.objects.get(pregunta=question, es_correcta=True)
        
        result = {
            'correct_option_id': correct_option.id,
            'question_time_limit': question.tiempo_limite,
            'is_correct': False, # Default
            'max_points': 0      # Default
        }

        if opcion_id is not None:
             # 2. Si se proporcionó una opción (cuando un jugador responde), obtener detalles de scoring
            selected_option = OpcionQuiz.objects.get(id=opcion_id, pregunta=question)
            
            result['is_correct'] = (selected_option.id == correct_option.id)
            result['max_points'] = selected_option.puntaje
            
        return result
    
    except (PreguntaQuiz.DoesNotExist, OpcionQuiz.DoesNotExist) as e:
        print(f"Error al obtener detalles de la opción: {e}")
        return None

@database_sync_to_async
def save_player_choice_and_update_score(user_id, question_id, is_correct, awarded_points):
    """Guarda la respuesta del jugador y actualiza su puntaje de forma segura."""
    User = apps.get_model('auth', 'User')
    PreguntaQuiz = apps.get_model('preguntaQuiz', 'PreguntaQuiz')
    UsuarioPuntaje = apps.get_model('usuarioPuntaje', 'UsuarioPuntaje')
    RespuestaUsuario = apps.get_model('respuestausuario', 'RespuestaUsuario')
    
    try:
        with transaction.atomic():
            user = User.objects.get(id=user_id)
            question = PreguntaQuiz.objects.get(id=question_id)
            
            # 1. Persist answer (avoiding duplicates)
            RespuestaUsuario.objects.get_or_create(
                usuario=user,
                pregunta=question,
                defaults={'sala': question.sala, 'es_correcta': is_correct}
            )
            
            # 2. Update UserPuntaje (solo si es correcta se añaden puntos)
            user_puntaje = UsuarioPuntaje.objects.get(usuario=user, sala=question.sala)
            
            if is_correct:
                user_puntaje.aciertos += 1
                user_puntaje.puntaje += awarded_points
            else:
                user_puntaje.fallos += 1

            user_puntaje.save()

            # 3. Return updated score
            return user_puntaje.puntaje

    except Exception as e:
        print(f"Error saving answer/score for user {user_id}: {e}")
        return None

# --- CONSUMER PRINCIPAL ---

class SalaConsumer(AsyncWebsocketConsumer):
    game_state = {} 
    
    async def connect(self):
        self.user = self.scope['user']
        
        if not self.user.is_authenticated:
            await self.close(code=4003) 
            return

        self.codigo_sala = self.scope['url_route']['kwargs']['codigo_sala']
        self.grupo_sala_nombre = f'sala_{self.codigo_sala}'
        self.sala_id = await get_sala_id_by_code(self.codigo_sala)

        if not self.sala_id:
            await self.close(code=4004) 
            return

        await self.channel_layer.group_add(self.grupo_sala_nombre, self.channel_name)
        await self.accept()

        await self.handle_join_lobby() 


    async def disconnect(self, close_code):
        if hasattr(self, 'grupo_sala_nombre') and self.user.is_authenticated:
            await delete_player_puntaje(self.user.id, self.codigo_sala)
        
            players = await get_current_lobby_players(self.codigo_sala)
            await self.channel_layer.group_send(
                self.grupo_sala_nombre,
                {'type': 'lobby_message', 'action': 'lobby_update', 'players': players}
            )
            
            await self.channel_layer.group_discard(self.grupo_sala_nombre, self.channel_name)
        
        if self.codigo_sala in SalaConsumer.game_state and SalaConsumer.game_state[self.codigo_sala].get('status') == 'active':
             pass 


    async def handle_join_lobby(self):
        user = self.scope['user']
        user_puntaje, created, message, sala_id = await create_or_get_user_puntaje(user.id, self.codigo_sala)
        
        if user_puntaje:
            players = await get_current_lobby_players(self.codigo_sala)
            await self.channel_layer.group_send(
                self.grupo_sala_nombre,
                {'type': 'lobby_message', 'action': 'lobby_update', 'players': players}
            )
        else:
             await self.send(text_data=json.dumps({'action': 'error', 'message': message}))
             await self.close(code=4000)


    async def handle_start_game(self):
        host_id = await get_sala_host_id(self.sala_id)
        
        if host_id != self.user.id:
            await self.send(text_data=json.dumps({'action': 'error', 'message': 'Solo el creador de la trivia puede iniciar la partida.'}))
            return

        # FIX: Se eliminó el "if self.codigo_sala not in SalaConsumer.game_state" aquí, 
        # ya que la lógica de prevención de doble inicio debe estar en el frontend, 
        # y esta función debe lanzarse cada vez que se presione.
        # El game_loop se encarga de la lógica de estado.
        
        players = await get_current_lobby_players(self.codigo_sala)
        if not players or len(players) < 1:
             await self.send(text_data=json.dumps({'action': 'error', 'message': 'Necesitas al menos un jugador para iniciar.'}))
             return

        if self.codigo_sala not in SalaConsumer.game_state:
            # K - INICIA EL BUCLE DE JUEGO (Game Loop)
            asyncio.create_task(self.game_loop())
        else:
            await self.send(text_data=json.dumps({'action': 'error', 'message': 'La partida ya está en curso.'}))


    async def game_loop(self):
        """Gestiona el flujo de preguntas y tiempos."""
        
        # 0. Inicializar el estado de forma segura y guardar el ID de la pregunta actual.
        SalaConsumer.game_state[self.codigo_sala] = {
            'status': 'active',
            'question_start_time': None,
            'current_question_id': None,
        }

        # 1. Obtener preguntas 
        questions = await get_sala_questions(self.sala_id) 
        
        try:
            if not questions:
                await self.channel_layer.group_send(
                    self.grupo_sala_nombre,
                    {'type': 'error', 'message': 'La sala no tiene preguntas para iniciar.'}
                )
                return

            # 2. Avisar a todos que el juego empieza
            await self.channel_layer.group_send(
                self.grupo_sala_nombre,
                {'type': 'game_control_message', 'action': 'game_started'}
            )
            await asyncio.sleep(1) 
            
            # 3. Iterar sobre las preguntas
            for i, q in enumerate(questions):
                
                # A. Actualizar estado del juego con la pregunta actual y el tiempo
                SalaConsumer.game_state[self.codigo_sala]['current_question_id'] = q['id']
                SalaConsumer.game_state[self.codigo_sala]['question_start_time'] = time.time() 

                # B. Enviar pregunta
                await self.channel_layer.group_send(
                    self.grupo_sala_nombre,
                    {'type': 'game_control_message', 'action': 'question_start', 'question_index': i, 'question': q}
                )
                
                # C. Esperar tiempo de respuesta
                await asyncio.sleep(q['tiempo_limite']) 

                # D. Finalizado el tiempo: Revelar Respuesta Correcta y Scores
                details = await get_option_details(q['id'], None) 
                correct_option_id = details['correct_option_id'] if details else None
                
                scores = await get_updated_scores(self.sala_id) 

                await self.channel_layer.group_send(
                    self.grupo_sala_nombre,
                    {
                        'type': 'game_control_message', 
                        'action': 'question_end', 
                        'correct_option_id': correct_option_id, 
                        'scores': scores,
                    }
                )
                
                # E. PAUSA DE 3 SEGUNDOS PARA MOSTRAR FEEDBACK
                await asyncio.sleep(3) 
                
            # 5. Fin del Juego
            await self.channel_layer.group_send(
                self.grupo_sala_nombre,
                {'type': 'game_control_message', 'action': 'game_finish', 'sala_id': self.sala_id}
            )
            # K - Tiempo de gracia para que el cliente redirija
            await asyncio.sleep(0.5) 
            
        finally:
            if self.codigo_sala in SalaConsumer.game_state:
                del SalaConsumer.game_state[self.codigo_sala]


    async def process_submit_answer(self, data):
        """Calcula el puntaje de forma segura en el servidor, actualiza la DB y envía feedback individual."""
        user_id = self.user.id
        opcion_id = data.get('opcion_id')
        question_id = data.get('question_id')
        
        # 1. Verificar si el juego/pregunta está activo
        game_state = SalaConsumer.game_state.get(self.codigo_sala, {})
        start_time = game_state.get('question_start_time')
        current_q_id = game_state.get('current_question_id')
        
        # K - FIX: Se agregó chequeo de tiempo para evitar respuestas tardías
        time_elapsed = time.time() - start_time
        
        question_instance = await database_sync_to_async(apps.get_model('preguntaQuiz', 'PreguntaQuiz').objects.get)(id=question_id)
        time_limit = question_instance.tiempo_limite
        
        if not start_time or current_q_id != question_id or time_elapsed > time_limit:
             # Si no está activa o se acabó el tiempo, se registra como incorrecta/tardía (0 puntos)
             new_score = await save_player_choice_and_update_score(user_id, question_id, False, 0)
             await self.send(text_data=json.dumps({
                 'action': 'answer_feedback', 'is_correct': False, 'points_awarded': 0, 'total_score': new_score
             }))
             return
        
        # 2. Obtener detalles y calcular tiempo restante 
        time_spent = time_elapsed
        time_remaining = max(0, time_limit - time_spent)
        
        details = await get_option_details(question_id, opcion_id)
        
        if not details or not 'question_time_limit' in details or details['max_points'] is None:
            await self.send(text_data=json.dumps({'action': 'error', 'message': 'Opción o Pregunta no válida/Sin puntaje base.'}))
            return

        is_correct = details['is_correct']
        
        awarded_points = 0
        if is_correct:
            max_points = details['max_points'] 
            awarded_points = int(max_points * (time_remaining / time_limit))
        
        # 3. Guardar respuesta y actualizar puntaje en DB
        new_total_score = await save_player_choice_and_update_score(
            user_id, question_id, is_correct, awarded_points
        )
        
        # 4. Enviar feedback individual
        await self.send(text_data=json.dumps({
            'action': 'answer_feedback',
            'is_correct': is_correct,
            'points_awarded': awarded_points,
            'total_score': new_total_score,
        }))


    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        
        if action == 'start_game':
            await self.handle_start_game()
        
        if action == 'submit_answer':
            await self.process_submit_answer(data)


    async def lobby_message(self, event):
        await self.send(text_data=json.dumps({
            'action': event['action'],
            'players': event['players']
        }))
        
    async def game_control_message(self, event):
        await self.send(text_data=json.dumps(event))
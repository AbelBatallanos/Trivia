## Api TRIVIA:
  Entidades Principales
La API está diseñada alrededor de las siguientes entidades principales que interactúan entre sí:

Usuario: Representa el perfil de un jugador.

Sala: Un espacio de juego para una sesión de trivia.

UsuarioPuntaje: Registra el puntaje de un usuario en una sala específica.

Pregunta: Una pregunta de trivia con sus posibles respuestas.

Opcion: Una posible respuesta a una pregunta, con un indicador de si es la correcta.

## Uso de la API
A continuación, se detallan los endpoints principales y cómo interactuar con ellos.

### Generar una Sala
Este endpoint permite crear una nueva sala de trivia con sus preguntas y opciones asociadas.

URL: http://localhost:8000/trivia/sala/

Método: POST

Descripción: Crea una nueva sala de trivia, definiendo su título, categoría, capacidad y las preguntas que contendrá.

{
  "titulo": "Sala de Matemáticas",
  "categoria": "Matemáticas",
  "capacidad": 5,
  "estado": "publica",
  "preguntas": [
    {
      "pregunta": "¿Cuánto es 2 + 2?",
      "orden": 1,
      "tiempo_limite": 30,
      "opciones": [
        {
          "descripcion": "4",
          "es_correcta": true,
          "puntaje": 10
        },
        {
          "descripcion": "5",
          "es_correcta": false,
          "puntaje": 0
        }
      ]
    }
  ]
}

Requisitos
Python 3.x

Pip (gestor de paquetes de Python)

Pasos de Instalación
Clona el repositorio



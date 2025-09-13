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
Clona el repositorio: https://github.com/AbelBatallanos/Trivia.git

### Uso de docker con Django

Debes Abrir Docker Desktop y luego abrir el proyecto.

En la consola del ID debes asegurarte que debes de estar dentro del directorio  software\backend luego ejecutas el siguente comando:
  Paso 1.- docker-compose exec web bash

  Paso 2.- python manage.py makemigrations

  Paso 3.- python manage.py migrate

Luego de eso revisa la carpeta  "docker-compose.yml", dónde tiene toda la configuracion de la Base de datos  

Debes dirigirte a esta url, para configurar la baase de datos  http://localhost:5050/
ingresa los datos : PGADMIN_DEFAULT_EMAIL ,  PGADMIN_DEFAULT_PASSWORD
pgadmin:  
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: 12345678
    ports:
      - "5050:80"
    depends_on:
      - db
#### luego:

Crea una BD con estos datos:
db:
    image: postgres:15
    environment:
      POSTGRES_DB: software
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
    volumes:
      - postgres_data:/var/lib/postgresql/data

#### Luego de toda la configuracion ingresa a esta url  http://localhost:8000/trivia/sala/


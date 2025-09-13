## Api TRIVIA:
  Entidades Principales:
  -Usuario
  -Sala
  -UsuarioPuntaje
  -Pregunta
  -Opcion

-#### -------- CONSULTAR API ---------
  Generar Sala:
  Url : http://localhost:8000/trivia/sala/    ( method: post )
  
  Estructura JSON:
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
        {"descripcion": "4", "es_correcta": true, "puntaje": 10},
        {"descripcion": "5", "es_correcta": false, "puntaje": 0}
      ]
    }
  ]
  }


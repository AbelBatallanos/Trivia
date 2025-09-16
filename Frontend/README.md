# TriviaApp Frontend (Estilo Kahoot)

El objetivo de este proyecto es simular las funcionalidades clave de una plataforma de trivias, desde la creación de cuestionarios hasta la participación en una partida en tiempo real.

## ✨ Características Principales (Frontend)

Actualmente, el frontend de la aplicación cuenta con las siguientes funcionalidades completas (simuladas, sin conexión a backend):

* **Flujo de Autenticación Moderno:** Una pantalla de Login/Registro con un selector deslizable para una experiencia de usuario fluida.
* **Dashboard Condicional:** La pantalla de inicio (`Home`) muestra contenido diferente dependiendo de si el usuario ha iniciado sesión o no.
* **Flujo Completo para el Creador:**
    * Un editor de trivias visual e interactivo para crear y modificar preguntas.
    * Funcionalidad para añadir preguntas, editar respuestas y marcar la correcta.
    * Una pantalla final para configurar los detalles de la trivia antes de lanzarla.
* **Flujo Completo para el Jugador:**
    * Opción para unirse a una partida sin necesidad de registro.
    * Pantalla para introducir PIN y apodo.
    * Una sala de espera (Lobby) antes de empezar el juego.
    * Pantalla de juego interactiva con temporizador por pregunta y feedback visual.
    * Pantalla de resultados final con un podio para el ganador.
* **Navegación Personalizada:** Una barra de pestañas inferior con un diseño único y un botón central resaltado, inspirada en la UI de Kahoot.
* **Arquitectura Modular:** El código está organizado en componentes reutilizables y una estructura de carpetas clara para facilitar su mantenimiento y escalabilidad.

## 🛠️ Tecnologías Utilizadas

* **Framework:** React Native con Expo
* **Lenguaje:** TypeScript
* **Navegación:** Expo Router (basada en archivos)
* **Manejo de Estado:** Zustand (para estado global simple)
* **Estilos:** StyleSheet de React Native (Flexbox)

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:
* [Node.js](https://nodejs.org/) (versión LTS recomendada)
* [Git](https://git-scm.com/)

### Pasos

1.  **Clonar el Repositorio**
    ```bash
    git clone [https://github.com/AbelBatallanos/Trivia](hhttps://github.com/AbelBatallanos/Trivia/Frontend)
    ```

2.  **Navegar al Directorio**
    ```bash
    cd Trivia/Frontend
    ```

3.  **Instalar Dependencias**
    ```bash
    npm install
    ```

## ▶️ Cómo Ejecutar el Proyecto

1.  **Iniciar el Servidor de Desarrollo**
    Una vez instaladas las dependencias, ejecuta el siguiente comando en la terminal:
    ```bash
    npx expo start
    ```
// Usaremos el cliente WebSocket nativo de React Native/Web

import { useAuthStore } from "@/store/authstore";

const WS_URL = 'ws://localhost:8000/ws/trivia/sala/'; 

let socket: WebSocket | null = null;
let roomCode: string | null = null;

// Función para conectar el socket
export const connectSalaSocket = (
    code: string, 
    onMessageReceived: (data: any) => void,
    onConnectionStatus: (status: boolean) => void // <-- NUEVO: Callback de estado
) => {

    // 1. OBTENER EL TOKEN DESDE ZUSTAND
    const token = useAuthStore.getState().token

    // 2. AÑADIR EL TOKEN COMO PARAMETRO DE CONSULTA
    let fullUrl = `${WS_URL}${code}/`;
    if (token) {
        fullUrl = `${fullUrl}?token=${token}`
    } else{
        // Si no hya token, deberiamos rechzar la conexion en el cliente
        onConnectionStatus(false)
        console.error("Autentificaion requirida: token no encontrado");
        return
    }
    if (socket && socket.readyState === WebSocket.OPEN && roomCode === code) {
        console.log("Socket ya conectado a la sala.");
        onConnectionStatus(true); // <-- Si ya está abierto, notificar inmediatamente
        return;
    }
    
    roomCode = code;
    // const fullUrl = `${WS_URL}${code}/`;
    socket = new WebSocket(fullUrl);

    socket.onopen = () => {
        console.log(`WebSocket conectado a la sala: ${code}`);
        onConnectionStatus(true); // <-- NOTIFICAR: CONECTADO CORRECTAMENTE
        sendSocketMessage('join_lobby', { nickname: 'Jugador Temp' }); 
    };

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        onMessageReceived(data); 
    };

    socket.onclose = (e) => {
        console.log('WebSocket desconectado.', e.code, e.reason);
        onConnectionStatus(false); // <-- NOTIFICAR: DESCONECTADO/CERRADO
    };

    socket.onerror = (e) => {
        console.error('WebSocket error:', e);
        // Podrías notificar un error o un intento de reconexión aquí
    };
};

// Función para enviar mensajes al servidor
export const sendSocketMessage = (action: string, payload: object) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action, ...payload }));
    } else {
        console.warn("WebSocket no está abierto. No se pudo enviar el mensaje:", action);
    }
};

// Función para cerrar la conexión
export const closeSalaSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
        roomCode = null;
    }
};
import axios from 'axios';
import { useAuthStore } from '@/store/authstore'; 

const API_URL = 'http://localhost:8000/trivia'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Antes de cada petición, se intercepta para añadir el token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; 
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
},
(error) => {
    return Promise.reject(error);
});

export const createTrivia = (triviaData: any) => {
  return api.post('/sala/', triviaData);
};

export const getMyTrivias = () => {
  return api.get('/sala/showMysalas/');
};

export const findTriviaByCode = (code: string) => {
  return api.get(`/sala/join/${code}/`);
}

export const getTriviaQuestions = (salaId: string) => {
  return api.get(`/game/sala/${salaId}/pregunta/listar`);
}

export default api;
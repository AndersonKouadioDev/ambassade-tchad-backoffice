import { baseURL } from '@/config';
import axios from 'axios';
export const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Config pour la base url : 
export const API_CONFIG = {
    baseURL: (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8081') + '/api/v1'
}
// Intercepteur pour les requêtes (ajout du token d'authentification)
api.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour les réponses (gestion des erreurs globales)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // if (error.response?.status === 401) {
        //     localStorage.removeItem('token');
        //     window.location.href = '/login';
        // }
        return Promise.reject(error);
    }
);

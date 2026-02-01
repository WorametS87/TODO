import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000, // 5 second timeout instead of 10
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        // Log error details
        if (!error.response) {
            console.error('Network error:', error.message);
        } else {
            console.error('API error:', error.response.status, error.response.data);
        }

        return Promise.reject(error);
    }
);

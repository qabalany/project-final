import axios from 'axios';

// Create a customized instance of Axios
const apiClient = axios.create({
    // This points to our Node.js backend running on port 8080
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Before ANY request leaves the frontend, run this function
apiClient.interceptors.request.use(
    (config) => {
        // Check if the user is logged in by looking for their VIP wristband (token)
        const token = localStorage.getItem('token');

        // If they have a token, attach it to the "Authorization" header
        // so the backend's "protect" middleware lets them in!
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;

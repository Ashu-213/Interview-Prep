import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

//instance of axios with default config
const api = axios.create({
    baseURL: `${API_URL}/api/auth`,
    withCredentials: true
});

// API calls for authentication 
// register API call
export const registerUser = async (username, email, password) => {
    try {
        const response = await api.post('/register', {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// login API call
export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/login', {
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// logout API call
export const logoutUser = async () => {
    try {
        const response = await api.get('/logout');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// getMe API call
export const getMe = async () => {
    try {
        const response = await api.get('/getMe');
        return response.data;
    } catch (error) {
        throw error;
    }
};


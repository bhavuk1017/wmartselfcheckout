// src/utils/auth.js
import { jwtDecode } from 'jwt-decode';

export const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    console.log(token);
    if (token) {
        try {
            const decoded = jwtDecode(token);
            console.log(token);
            return decoded.id; // `id` should match the key used when signing the token
        } catch (error) {
            console.error('Invalid token:', error);
        }
    }
    return null;
};

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook to allow components to access AuthContext contents
export function useAuth() {
    return useContext(AuthContext);
}
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../firebase';

// Initializes the necessary values into AuthContext
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser ? { ... currentUser } : null);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }) {
    const { user, _ } = useAuth();
    
    return (
        (user != null) ? {children} : <Navigate to={"/"} replace />
    );
}
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute() {
    const { user, _ } = useAuth();
    
    return (
        (user != null) ? <Outlet /> : <Navigate to={"/login"} replace />
    );
}
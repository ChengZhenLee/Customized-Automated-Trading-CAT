import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ user, redirectPath="/" }) {
    return (
        (user != null) ? <Outlet /> : <Navigate to={redirectPath} replace />
    );
}
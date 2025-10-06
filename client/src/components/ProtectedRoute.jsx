import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ConfigContextProvider } from "./provider/ConfigContextProvider";

export function ProtectedRoute() {
    const { user, _ } = useAuth();
    
    return (
        (user != null) ? 
            <>
                <ConfigContextProvider >
                    <Outlet />
                </ConfigContextProvider>
            </> :
            <Navigate to={"/login"} replace />
    );
}
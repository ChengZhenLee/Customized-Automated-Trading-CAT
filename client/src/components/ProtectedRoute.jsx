import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ConfigContextProvider } from "./provider/ConfigContextProvider";
import { ResultsStaleProvider } from "./provider/ResultsStaleProvider"

export function ProtectedRoute() {
    const { user, _ } = useAuth();

    return (
        (user != null) ?
            <>
                <ConfigContextProvider >
                    <ResultsStaleProvider >
                        <Outlet />
                    </ResultsStaleProvider>
                </ConfigContextProvider>
            </> :
            <Navigate to={"/login"} replace />
    );
}
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

export function MainMenuPage() {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <button
                onClick={() => {
                    navigate("/dashboard")
                }}>
                Go To Dashboard
            </button>
            
            <button
                onClick={() => {
                    navigate("/myconfigs")
                }}>
                Go To My Configs
            </button>
        </>
    )
}
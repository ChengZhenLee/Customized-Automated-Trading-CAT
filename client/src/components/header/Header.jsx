import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseAuth";
import "./Header.css";

export function Header() {
    const navigate = useNavigate();
    const paths = {
        "/dashboard": "Dashboard", 
        "/myconfigs": "My Configs", 
        "/results": "Results",
        "/": "Main Menu"
    };
    const pathname = useLocation().pathname;

    async function LogOut() {
        try {
            await signOut(auth);
        } catch (e) {
            console.error(e.message);
        }

        navigate("/");
    }

    return (
        <div className="header-container">
            <button
                onClick={LogOut}>Logout
            </button>

            {Object.keys(paths).map((path) => {
                if (path != pathname) {
                    return (
                        <button
                            className="header-button"
                            key={`button-${path}`}
                            onClick={() => navigate(path)}>
                            Go to {paths[path]}
                        </button>
                    )
                }
            })}
        </div>
    );
}
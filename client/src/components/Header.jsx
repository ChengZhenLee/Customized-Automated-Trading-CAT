import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseAuth";

export function Header() {
    const navigate = useNavigate();
    const paths = {
        "/dashboard": "Dashboard", 
        "/myconfigs": "My Configs", 
        "results": "Results"
    };
    const pathname = useLocation().pathname;

    async function LogOut() {
        try {
            await signOut(auth);
            console.log("User successfully logged out");
        } catch (e) {
            console.log(e.message);
        }

        navigate("/");
    }

    return (
        <>
            <div>
                <button
                    onClick={LogOut}>Logout
                </button>

                {Object.keys(paths).map((path) => {
                    if (path != pathname) {
                        return (
                            <button 
                                key={`button-${path}`}
                                onClick={() => navigate(path)}>
                                Go to {paths[path]}
                            </button>
                        )
                    }
                })}
            </div>
        </>
    )
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export function SignUpPage() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null);
    const [exists, setExists] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            setExists(true);
        }
        else {
            setExists(false);
        }
    }, [error]);

    const handleSignUp = async (event) => {
        // Prevent the form submission from resetting the page
        event.preventDefault();
        // Reset previous errors
        setError(null);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("User successfully signed up");
            navigate("/dashboard");
        }
        catch (e) {
            setError(e.message);
            console.log(e.message);
        }
    };

    const goToLogin = () => {
        navigate("/");
    }

    return (
        <>
            <div>
                <h2>Create a new CAT account</h2>
            </div>

            <div>
                <div>
                    <p 
                        style={{display: exists ? "block" : "none" }}>
                        {error}
                    </p>
                </div>

                <form onSubmit={handleSignUp}>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="email"
                            onChange={(event) => { setEmail(event.target.value) }}>
                        </input>
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="password"
                            onChange={(event) => { setPassword(event.target.value) }}>
                        </input>
                    </div>

                    <button type="submit">Create Account</button>
                </form>
            </div>

            <div>
                <p>Go To Login Page</p>
                <button onClick={goToLogin}>Login</button>
            </div>
        </>
    );
}
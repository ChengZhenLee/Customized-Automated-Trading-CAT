import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export function LoginPage() {
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

    const handleLogin = async (event) => {
        // Prevent the form submission from resetting the page
        event.preventDefault();
        // Reset previous errors
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully!");
            navigate("/dashboard");
        }
        catch (e) {
            setError(e.message);
            console.log(error);
        }
    };

    const goToSignUp = () => {
        navigate("/signup");
    };

    return (
        <>
            <div>
                <h2>Welcome to Customized Automated Trading</h2>
            </div>

            <div>
                <div>
                    <p
                        style={{ display: exists ? "block" : "none" }}>
                        {error}
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <div>
                        <label>Email</label>
                        <input
                            type='email'
                            placeholder='e-mail'
                            onChange={(event) => { setEmail(event.target.value); }}>
                        </input>
                    </div>

                    <div>
                        <label>Password</label>
                        <input
                            type='password'
                            placeholder='password'
                            onChange={(event) => { setPassword(event.target.value); }}>
                        </input>
                    </div>

                    <button type='submit'>Login</button>
                </form>
            </div>

            <div>
                <p>Sign Up to CAT</p>
                <button onClick={goToSignUp}>Sign Up</button>
            </div>
        </>
    );
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export function Header() {
    const navigate = useNavigate();

    async function LogOut() {
        try {
            await signOut(auth);
            console.log("User successfully logged out");
        } catch(e) {
            console.log(e.message);
        }

        navigate("/");
    }

    return (
        <>
            <div>
                <button 
                    onClick={LogOut}>Logout</button>
            </div>
        </>
    )
}
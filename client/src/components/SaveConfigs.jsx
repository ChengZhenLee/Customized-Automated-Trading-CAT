import { useState } from "react";
import { useConfigContext } from "../hooks/useConfigContext";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase/firebaseStore";
import { collection, doc, addDoc } from "firebase/firestore";

export function SaveConfigs() {
    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [configName, setConfigName] = useState("");
    const { config, _ } = useConfigContext();
    const { user, __ } = useAuth();
    
    const userEmail = user?.email;

    async function saveConfigs() {
        try {
            // implement this function
            //checkConfigs(config);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
            return;
        }

        if (!configName.trim()) {
            setMessage("Error: not a valid config name");
            return;
        }

        if (!userEmail) {
            setMessage("Error: user email not found. Please log in again");
            return;
        }

        setIsSaving(true);
        setMessage("Saving config...");

        try {
            const userDocRef = doc(db, "users", userEmail);
            const configsCollectionRef = collection(userDocRef, "configs");

            await addDoc(configsCollectionRef, {
                configName: configName.trim(),
                createdAt: new Date(),
                config: config
            });
        } catch (error) {
            setMessage(`Error saving config: ${error.message}`);
        }

        setIsSaving(false);
    }

    return (
        <div>
            <input 
                type="text"
                placeholder="Please enter a name for your config"
                onChange={(event) => {
                    setConfigName(event.target.value);
                }}/>

            <button
                onClick={saveConfigs}
                disabled={!configName.trim() || !userEmail || isSaving}
            >Save Configs
            </button>

            <div>
                {message && 
                (
                    <p>{message}</p>
                )}
            </div>
        </div>
    );
}
import "./SaveConfig.css";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase/firebaseStore";
import { collection, doc, addDoc } from "firebase/firestore";
import { useConfigContext } from "../hooks/useConfigContext";

export function SaveConfig() {
    const [message, setMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [configName, setConfigName] = useState("");
    const { config, setConfig } = useConfigContext();
    const { user, __ } = useAuth();
    
    const userUid = user?.uid;

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

        if (!userUid) {
            setMessage("Error: user id not found. Please log in again");
            return;
        }

        // Save the config name
        setConfig((prevConfig) => ({
            ...prevConfig,
            "config_name": configName.trim()
        }));

        setIsSaving(true);
        setMessage("Saving config...");

        try {
            const userDocRef = doc(db, "/users", userUid);
            const configsCollectionRef = collection(userDocRef, "configs");

            await addDoc(configsCollectionRef, {
                configName: configName.trim(),
                createdAt: new Date(),
                config: config
            });

            setMessage("Config saved!");
        } catch (error) {
            // Delete the config name
            setConfig((prevConfig) => ({
                ...prevConfig,
                "config_name": ""
            }))
            setMessage(`Error saving config: ${error.message}`);
        }

        setIsSaving(false);
    }

    return (
        <div className="save-config-container">
            <input 
                type="text"
                placeholder="Please enter a name for your config"
                onChange={(event) => {
                    setConfigName(event.target.value);
                }}/>

            <button
                onClick={saveConfigs}
                disabled={!configName.trim() || isSaving}
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
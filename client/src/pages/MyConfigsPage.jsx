import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseStore";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { useConfigContext } from "../hooks/useConfigContext";
import { SubmitConfig } from "../components/SubmitConfig";
import { RenderConfigs } from "../components/Renderer";
import { Header } from "../components/header/Header"

export function MyConfigsPage() {
    const [message, setMessage] = useState("");
    const [allDocs, setAllDocs] = useState({});
    const { user } = useAuth();
    const { config, setConfig } = useConfigContext();

    useEffect(() => {
        async function fetchData() {
            const userUid = user?.uid;

            setMessage("Fetching your configs...");

            try {
                const userDocRef = doc(db, "users", userUid);
                const configsCollectionRef = collection(userDocRef, "configs");

                const querySnapshot = await getDocs(configsCollectionRef);

                querySnapshot.forEach((doc) => {
                    setAllDocs((previousDocs) => ({
                        ...previousDocs,
                        [doc.id]: doc.data()
                    }));
                });

                setMessage("Configs fetched!");
            } catch (error) {
                setMessage(`Error fetching data: ${error.message}`);
            }
        }

        fetchData();
    }, [user]);

    // Remove a document from the state when it is deleted
    function removeDocFromState(docIdToRemove) {
        if (allDocs[docIdToRemove].configName === config.config_name) {
            setConfig(
                {
                    "config_name": "",
                    "trader_settings": {},
                    "data_settings": {},
                    "signals": {
                        "signal_names": [],
                        "all_signal_params": {},
                        "all_signal_optimize_params": {}
                    },
                    "strategies": {
                        "strategy_names": [],
                        "all_strategy_params": {},
                        "all_strategy_optimize_params": {}
                    }
                });
        }

        setAllDocs((prevDocs) => {
            const newDocs = { ...prevDocs };
            delete newDocs[docIdToRemove];
            return newDocs;
        });
    }

    return (
        <div>
            <Header />

            {message && (
                <div>
                    {message}
                </div>
            )}

            <div className="flex-container">
                <div>
                    {config.config_name ? `Selected config: ${config.config_name}` : "no config selected"}
                </div>

                <div>
                    {
                        Object.keys(allDocs).length > 0 ?
                            Object.keys(allDocs)
                                .map((docId) => {
                                    return (
                                        <div key={docId}>
                                            <SingleDoc
                                                docId={docId}
                                                data={allDocs[docId]}
                                                onDeleteSuccess={removeDocFromState}
                                                setMessage={setMessage}
                                            />
                                        </div>
                                    );
                                }) :
                            "You do not have any saved configs"
                    }
                </div>

                <div>
                    <div>
                        Backtest with selected config
                    </div>

                    {config.config_name && <SubmitConfig />}
                </div>

                {config.config_name && (
                    <div>
                        <RenderConfigs configsData={config} />
                    </div>
                )}
            </div>
        </div>
    )
}

function SingleDoc({ docId, data, onDeleteSuccess, setMessage }) {
    const [isDeciding, setisDeciding] = useState(false);
    const { setConfig } = useConfigContext();
    const { user } = useAuth();

    const configName = data.configName;
    const userUid = user?.uid;

    async function handleConfirmDelete() {
        try {
            const userDocRef = doc(db, "users", userUid);
            const configsCollectionRef = collection(userDocRef, "configs");
            const currentDoc = doc(configsCollectionRef, docId);

            await deleteDoc(currentDoc);

            onDeleteSuccess(docId);
        } catch (error) {
            setMessage(`Error deleting config: ${error.message}`);
        }

        setisDeciding(false);
    }

    return (
        <>
            <div>
                {configName}
            </div>

            {isDeciding && (
                <div>
                    <span>
                        Are you sure?
                    </span>

                    <button
                        onClick={handleConfirmDelete}>
                        Yes
                    </button>

                    <button
                        onClick={() => setisDeciding(false)}>
                        No
                    </button>
                </div>

            )}

            <button
                onClick={() => setisDeciding(true)}
                disabled={isDeciding}>
                Delete Config
            </button>

            <button
                onClick={() => {
                    setConfig({
                        ...data.config,
                        "config_name": configName
                    });
                }}
                disabled={isDeciding}>
                Select Config
            </button>
        </>
    );
}
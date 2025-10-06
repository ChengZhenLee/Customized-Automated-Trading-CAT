import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseStore";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { useConfigContext } from "../hooks/useConfigContext";
import { SubmitConfig } from "../components/SubmitConfig";

export function MyConfigsPage() {
    const [message, setMessage] = useState("");
    const [allDocs, setAllDocs] = useState({});
    const [selectedConfigName, setSelectedConfigName] = useState("");
    const { user, __ } = useAuth();
    const navigate = useNavigate();

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
        if (allDocs[docIdToRemove].configName === selectedConfigName) {
            setSelectedConfigName("");
        }

        setAllDocs((prevDocs) => {
            const newDocs = { ...prevDocs };
            delete newDocs[docIdToRemove];
            return newDocs;
        });
    }

    return (
        <div>
            {message && (
                <div>
                    {message}
                </div>
            )}


            <div>
                {selectedConfigName ? `Selected config: ${selectedConfigName}` : "no config selected"}
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
                                        setSelectedConfigName={setSelectedConfigName}
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

                { selectedConfigName && <SubmitConfig /> }
            </div>

            <div>
                <button
                    onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                </button>
            </div>
        </div>
    )
}

function SingleDoc({ docId, data, setSelectedConfigName, onDeleteSuccess, setMessage }) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { _, setConfig } = useConfigContext();
    const { user, __ } = useAuth();

    const configName = data.configName;
    const userUid = user?.uid;

    async function handleConfirmDelete() {
        setIsConfirming(false);
        setIsDeleting(true);

        try {
            const userDocRef = doc(db, "users", userUid);
            const configsCollectionRef = collection(userDocRef, "configs");
            const currentDoc = doc(configsCollectionRef, docId);

            await deleteDoc(currentDoc);

            onDeleteSuccess(docId);
        } catch (error) {
            setMessage(`Error deleting config: ${error.message}`);
        }

        setIsDeleting(false);
    }

    return (
        <>
            <div>
                {configName}
            </div>

            {isConfirming && (
                <div>
                    <span>
                        Are you sure?
                    </span>

                    <button
                        onClick={handleConfirmDelete}>
                        Yes
                    </button>

                    <button
                        onClick={() => setIsConfirming(false)}>
                        No
                    </button>
                </div>

            )}

            <button
                onClick={() => setIsConfirming(true)}
                disabled={isConfirming || isDeleting}>
                Delete Config
            </button>

            <button
                onClick={() => {
                    setSelectedConfigName(configName);
                    setConfig(data.config);
                    console.log(data.config);
                }}
                disabled={isConfirming || isDeleting}>
                Select Config
            </button>
        </>
    );
}
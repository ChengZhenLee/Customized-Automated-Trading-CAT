import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStorageResults, setStorageResults } from "../storedData";
import { useResultsStaleContext } from "../hooks/useResultsStaleContext";

export function ResultsPage() {
    const location = useLocation();
    const statusUrlRef = useRef(location.state?.data?.status_url);
    const [finalData, setFinalData] = useState(null);
    const [pollStatus, setPollStatus] = useState("pending");
    const { resultsStale, setResultsStale } = useResultsStaleContext();

    useEffect(() => {
        // Try to retrieve cached results
        const cachedResults = getStorageResults();
        console.log(resultsStale);
        // If there are already results cached
        if (cachedResults && !resultsStale) {
            setFinalData(getStorageResults());
            setPollStatus("success");
            return;
        }

        // If there were no cached results and no valid status url
        if (!statusUrlRef.current) {
            setPollStatus("fail");
            return;
        }

        // The polling function
        async function pollResults() {
            const response = await axios.get(statusUrlRef.current);
            const statusCode = response.status;

            // The task is completed and successful
            if (statusCode === 200 && response.data.status === "completed") {
                if (response.data.status === "completed") {
                    setPollStatus("success");
                    setFinalData(response.data);
                    setStorageResults(response.data);
                    setResultsStale(false);
                    return;
                }
                // There was an issue in the backend 
            } else if (statusCode === 500) {
                setPollStatus("fail");
            }

            // Poll again after 5 second
            setTimeout(pollResults, 5000);
        }

        // Start polling for the results if the results is stale
        if (resultsStale) {
            pollResults();
        }
    }, [location, statusUrlRef, resultsStale, setResultsStale]);

    return (
        <>
            {pollStatus === "success" && (
                <>
                    <Results finalData={finalData} />
                    <NavButtons />
                </>
            )}
            {pollStatus === "pending" && (
                <div>
                    Loading...
                </div>
            )}
            {pollStatus === "fail" && (
                <>
                    <div>
                        Unable to perform backtest and fetch results. Please resubmit a config.
                    </div>
                    <NavButtons />
                </>
            )}
        </>
    );
}

export function Plot({ finalData }) {
    return (
        <>
            {finalData &&
                <img src={`data:image/jpeg;base64,${finalData.plot_data}`}></img>
            }
        </>
    );
}

export function Results({ finalData }) {
    return (
        <div>
            {/* <div>
                <RenderConfig />
            </div> */}

            <div>
                <Plot finalData={finalData} />
            </div>
        </div>
    );
}

export function NavButtons() {
    const navigate = useNavigate();

    return (
        <>
            <div>
                <button
                    onClick={() => navigate("/")}>
                    Go to Main Menu
                </button>

                <button
                    onClick={() => navigate("/myconfigs")}>
                    Go to Your Configs
                </button>

                <button
                    onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                </button>
            </div>
        </>
    );
}
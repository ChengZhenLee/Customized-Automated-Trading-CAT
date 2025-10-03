import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function ResultsPage() {
    const location = useLocation();
    const statusUrlRef = useRef(null);
    const stopPollingRef = useRef(false);
    const [finalData, setFinalData] = useState(null);

    // Get the statusUrl once on mount
    useEffect(() => {
        statusUrlRef.current = location.state?.data?.status_url;
        console.log(statusUrlRef.current);
    }, [location]);

    // Start polling once on mount
    useEffect(() => {
        let timeoutId;

        // If no statusUrl was received, don't poll
        if (!statusUrlRef.current) {
            return;
        }

        // The polling function
        const poll = async () => {
            // Stop the polling
            if (stopPollingRef.current) {
                return;
            }

            try {
                const response = await axios.get(statusUrlRef.current);
                const statusCode = response.status;

                // The task is completed and successful
                if (statusCode === 200 && response.data.status === "Completed") {
                    console.log(response.data);
                    setFinalData(response.data);
                    stopPollingRef.current = true;

                    // There was an issue in the backend 
                    // or the results in the backend was already retrieved
                } else if (statusCode === 500) {
                    console.log(response.data);
                    stopPollingRef.current = true;

                    // The task is still pending
                } else {
                    console.log("pending");
                }
                // If there was a server error or axios error
            } catch (error) {
                console.log(error.message);
                stopPollingRef.current = true;
            }

            // Poll again after 5 seconds
            if (!stopPollingRef.current) {
                timeoutId = setTimeout(poll, 5000);
            }
        }

        // start polling immediately
        timeoutId = setTimeout(poll, 0);

        // On unmount
        return () => {
            // Clear any currently running Timeout
            clearTimeout(timeoutId);
            // Stop any currently running poll
            stopPollingRef.current = true;
        }
    }, [location]);

    return (
        <div>
            <Plot />
            <ResultsLog />
        </div>
    );
}

export function Plot() {
    return (
        <></>
    );
}

export function ResultsLog() {
    return (
        <></>
    );
}
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function ResultsPage() {
    const location = useLocation();
    const [status, setStatus] = useState("pending");
    const [data, setData] = useState({});
    const [error, setError] = useState(null);
    const pollIdRef = useRef(null);

    useEffect(() => {
        const data = location.state?.data;
        const statusUrl = data.status_url;

        pollIdRef.current = setInterval(() => { getResults(statusUrl) }, 5000);
    }, [location.state]);

    async function getResults(statusUrl) {
        try {
            const response = await axios.get(statusUrl)
            const resultData = response.data;
            if (response.status === "completed" || response.status === "failed") {
                if (pollIdRef.current) {
                    clearInterval(pollIdRef.current);
                    pollIdRef.current = null;
                }

                setStatus(resultData.status);
                setData(resultData);

                if (resultData.status === "failed") {
                    setError(resultData.error);
                }
            } else {
                setStatus(resultData.status);
            }
        } catch (error) {
            let message = "A connection or server error occurred";
            console.log(pollIdRef.current);

            if (pollIdRef.current) {
                clearInterval(pollIdRef.current);
                pollIdRef.current = null;
            }

            setStatus("failed");

            if (error.response) {
                message = error.response;
            } else if (error.request) {
                message = error.request;
            } else {
                message = error.message;
            }
            setError(message);
            console.error(message);
        }
    }

    console.log(status)
    console.log(error)
    console.log(data)

    return (
        <div>
            <Plot />
            <ResultsLog />
        </div>
    );
}

export function Plot() {

}

export function ResultsLog() {

}
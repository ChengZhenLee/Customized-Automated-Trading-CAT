import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function ResultsPage() {
    const location = useLocation();
    const statusUrlRef = useRef(null);
    const [finalData, setFinalData] = useState(null);

    // Get the statusUrl once on mount
    useEffect(() => {
        statusUrlRef.current = location.state?.data?.status_url;
        console.log(statusUrlRef.current);
    }, [location]);

    // Start polling once on mount
    useEffect(() => {
        // If no statusUrl was received, don't poll
        if (!statusUrlRef.current) {
            return;
        }

        // The polling function
        const poll = async () => {

            try {
                const response = await axios.get(statusUrlRef.current);
                const statusCode = response.status;

                console.log(statusCode);

                // The task is completed and successful
                if (statusCode === 200 && response.data.status === "completed") {
                    console.log(response.data.message);
                    setFinalData(response.data);
                    return;

                // The task was already retrieved
                } else if (statusCode === 200 && response.data.status === "retrieved") {
                    console.log(response.data.message);
                    return;

                // There was an issue in the backend 
                // or the results in the backend was already retrieved
                } else if (statusCode === 500) {
                    console.log(response.data);
                    return;

                // The task is still pending
                } else {
                    console.log("pending");
                }
            // If there was a server error or axios error
            } catch (error) {
                console.log(error.message);
                return;
            }

            // Poll again after 1 second
            setTimeout(poll, 5000);
        }

        // start polling after 1 second
        setTimeout(poll, 5000);
    }, [location]);

    return (
        <div>
            <Plot finalData={finalData} />
            <ResultsLog finalData={finalData} />
        </div>
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

export function ResultsLog({ finalData }) {
    return (
        <></>
    );
}
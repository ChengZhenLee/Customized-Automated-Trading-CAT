import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useConfigContext } from "../hooks/useConfigContext";
import { useResultsStaleContext } from "../hooks/useResultsStaleContext";

export function SubmitConfig() {
    const { config } = useConfigContext();
    const { setResultsStale } = useResultsStaleContext();
    const navigate = useNavigate();

    async function submitConfig() {
        const {"config_name": _, ...submissionData} = config;
        if (config) {
            try {
                const response = await axios.post("/backtrader", submissionData);

                // The config submission was successful
                if (response.status === 202) {
                    console.log(response.data);
                    setResultsStale(true);
                    navigate("/results", { state: { data: response.data } });
                }

                // There was an error trying to submit the config
                else {
                    console.error(response.data.error);
                }
            // axios error
            } catch (error) {
                console.log(error);
            }

        }
    }

    return (
        <>
            <button
                onClick={submitConfig}>
                Submit your config!
            </button>
        </>
    );
}
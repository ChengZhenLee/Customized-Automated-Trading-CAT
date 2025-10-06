import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useConfigContext } from "../hooks/useConfigContext";

export function SubmitConfig() {
    const { config, _ } = useConfigContext();
    const navigate = useNavigate();

    async function submitConfig() {
        const {"config_name": _, ...submissionData} = config;
        if (config) {
            try {
                const response = await axios.post("/backtrader", submissionData);

                // The config submission was successful
                if (response.status === 202) {
                    console.log(response.data);
                    navigate("/results", { state: { data: response.data } });
                }

                // There was an error trying to submit the config
                else {
                    console.error(response.data.error);
                }
            // axios error
            } catch (error) {
                console.log(error.response.data);
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useConfigContext } from "../hooks/useConfigContext";

export function SubmitConfig() {
    const { config, _ } = useConfigContext();
    const navigate = useNavigate();

    async function submitConfig() {
        if (config) {
            try {
                console.log(config);
                await axios.post("/backtrader", config)
                    .then((response) => {
                        if (response.data.status === "error") {
                            console.log(response.data.message)
                        }
                        else {
                            console.log(response.data);
                            navigate("/results", { state: { data: response.data } });
                        }

                    });
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
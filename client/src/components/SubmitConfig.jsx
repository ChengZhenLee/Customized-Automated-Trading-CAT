import { useConfigContext } from "../hooks/useConfigContext";

export function SubmitConfig() {
    const { config, _ } = useConfigContext();

    return (
        <>
            <button
                onClick={submitConfig}>
                Submit your config!
            </button>
        </>
    );
}
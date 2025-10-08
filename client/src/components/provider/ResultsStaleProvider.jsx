import { useState } from "react";
import { ResultsStaleContext } from "../../context/ResultsStaleContext";

// Fetch the state stored in session storage
function getInitialState() {
    const storedValue = sessionStorage.getItem("StaleValue");

    // If there is no stored value, default to true
    if (!storedValue) {
        return (true);
    }

    return (storedValue === "true");
}

export function ResultsStaleProvider({ children }) {
    const [resultsStale, setResultsStale] = useState(getInitialState());

    // set the new resultsStale value, as well as store it in session storage
    // so that the value persists across reloads
    function setPersistedResultsStale(newValue) {
        setResultsStale(newValue);
        sessionStorage.setItem("StaleValue", JSON.stringify(newValue));
    }

    return (
        <ResultsStaleContext.Provider value={{ resultsStale, setResultsStale: setPersistedResultsStale }}>
            {children}
        </ ResultsStaleContext.Provider>
    );
}
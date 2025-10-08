import { useState } from "react";
import { ResultsStaleContext } from "../../context/ResultsStaleContext";

function getInitialState() {
    const storedValue = sessionStorage.getItem("StaleValue");
    
    if (!storedValue) {
        return (true);
    }

    return (storedValue === "true");
}

export function ResultsStaleProvider({ children }) {
    const [resultsStale, setResultsStale] = useState(getInitialState());

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
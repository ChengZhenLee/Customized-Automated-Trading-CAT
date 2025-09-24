import { useState } from "react";
import { SelectedSignalsContext } from "../../context/SelectedSignalsContext";

export function SelectedSignalsProvider({ children }) {
    const [selectedSignals, setSelectedSignals] = useState([]);

    return (
        <SelectedSignalsContext.Provider value={{ selectedSignals, setSelectedSignals }}>
            {children}
        </SelectedSignalsContext.Provider>
    );
}
import { useState } from "react";
import { SelectedStrategiesContext } from "../../context/SelectedStrategiesContext";

export function SelectedStrategiesProvider({ children }) {
    const [selectedStrategies, setSelectedStrategies] = useState([]);

    return (
        <SelectedStrategiesContext.Provider value={{ selectedStrategies, setSelectedStrategies }}>
            {children}
        </SelectedStrategiesContext.Provider>
    );
}
import { useState } from "react";
import { ConfigContext } from "../../context/ConfigContext"; 

export function ConfigContextProvider({ children }) {
    const [config, setConfig] = useState({
        "trader_settings": {},
        "data_settings": {},
        "signals": {},
        "strategies": {}
    });

    return (
        <ConfigContext.Provider value={{ config, setConfig }}>
            {children}
        </ConfigContext.Provider>
    );
}
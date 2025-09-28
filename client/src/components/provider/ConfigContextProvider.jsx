import { useState } from "react";
import { ConfigContext } from "../../context/ConfigContext"; 

export function ConfigContextProvider({ children }) {
    const [config, setConfig] = useState({
        "trader_settings": {},
        "data_settings": {},
        "signals": {
            "signal_names": [],
            "all_signal_params": {},
            "all_signal_optimize_params": {}
        },
        "strategies": {
            "strategy_names": [],
            "all_strategy_params": {},
            "all_strategy_optimize_params": {}
        }
    });

    return (
        <ConfigContext.Provider value={{ config, setConfig }}>
            {children}
        </ConfigContext.Provider>
    );
}
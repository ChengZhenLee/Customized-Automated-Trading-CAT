import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Header } from "../components/Header";
import { DataSettings } from "../components/data-settings/DataSettings";
import { TraderSettings } from "../components/trader-settings/TraderSettings";
import { SignalSettings } from "../components/signals/SignalSettings";
import { StrategySettings } from "../components/strategies/StrategySettings";
import { SaveConfig } from "../components/SaveConfig";
import { SubmitConfig } from "../components/SubmitConfig";
import { useConfigContext } from "../hooks/useConfigContext";

export function DashboardPage() {
    const [makeNewConfig, setMakeNewConfig] = useState(false);
    const { config, setConfig } = useConfigContext();
    const navigate = useNavigate();

    function toggleMakeNewConfig() {
        // Reset the config if the current state is False (i.e., about to become True)
        if (!makeNewConfig) {
            setConfig(
                {
                    "config_name": "",
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
        }

        // Toggle the state
        setMakeNewConfig((prevState) => !prevState);
    }

    return (
        <>
            <Header />

            {
                !makeNewConfig && (
                    <>
                        {config.config_name ?
                            <p>Selected Config: {config.config_name}</p> :
                            <p>No Config Selected</p>
                        }
                        <button
                            onClick={toggleMakeNewConfig}>
                            Make a new config
                        </button>
                    </>
                )
            }



            {
                makeNewConfig && (
                    <>
                        <DataSettings />
                        <TraderSettings />

                        <DndProvider backend={HTML5Backend}>
                            <SignalSettings />
                            <StrategySettings />
                        </DndProvider>

                        <SaveConfig />
                    </>
                )
            }

            {(makeNewConfig || config.config_name) &&
                <SubmitConfig />
            }
        </>
    );
}
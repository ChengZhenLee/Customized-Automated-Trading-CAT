import "./DashboardPage.css";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Header } from "../components/header/Header";
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

            <div className="content-container">
                {
                    !makeNewConfig && (
                        <div className="new-config-container">
                            <h2>
                                {config.config_name ?
                                    `Selected Config: ${config.config_name}` :
                                    "No Config Selected"
                                }
                            </h2>

                            <button
                                onClick={toggleMakeNewConfig}>
                                Make a new config
                            </button>
                        </div>
                    )
                }

                <div className="settings-container">
                    {
                        makeNewConfig && (
                            <>
                                <div className="data-trader-settings-container">
                                    <DataSettings />
                                    <TraderSettings />
                                </div>

                                <DndProvider backend={HTML5Backend}>
                                    <div className="signals-strategies-settings-container">
                                        <SignalSettings />
                                    </div>
                                    <div className="signals-strategies-settings-container">
                                        <StrategySettings />
                                    </div>
                                </DndProvider>

                                <SaveConfig />
                                {(makeNewConfig || config.config_name) &&
                                    <SubmitConfig />
                                }
                            </>
                        )
                    }
                </div>
            </div>
        </>
    );
}
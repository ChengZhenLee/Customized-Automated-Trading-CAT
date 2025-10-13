import "../Settings.css";
import { useEffect } from "react";
import { useDrop } from "react-dnd";
import { useSelectedStrategies } from "../../hooks/useSelectedStrategies";
import { useConfigContext } from "../../hooks/useConfigContext";

export function SelectedStrategiesBlock() {
    const { selectedStrategies, setSelectedStrategies } = useSelectedStrategies();
    const { _, setConfig } = useConfigContext();

    //Update the config everytime selectedSignals is updated
    useEffect(() => {
        const strategyNames = selectedStrategies.map((strategy) => strategy.name);
        setConfig((prevConfigs) => {
            const strategies = prevConfigs.strategies || {};

            return ({
                ...prevConfigs,
                "strategies": {
                    ...strategies,
                    "strategy_names": strategyNames
                }
            });
        });
    }, [selectedStrategies, setConfig]);

    //Define the behaviour when items are dropped on the block
    const [, drop] = useDrop(() => ({
        accept: "STRATEGY",
        drop: (strategy) => {
            setSelectedStrategies((prevStrategies) => {
                if (!prevStrategies.some(
                    (elem) => elem.name === strategy.name)) {
                    return ([...prevStrategies, strategy]);
                }
                return (prevStrategies);
            });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    }));

    function handleRemove(strategyToRemove) {
        const newStrategies = selectedStrategies.filter(
            (strategy) => strategy.name != strategyToRemove.name
        );
        setSelectedStrategies(newStrategies);

        setConfig((prevConfigs) => {
            const strategies = prevConfigs.strategies || {};
            const allStrategyParams = strategies.all_strategy_params || {};

            const { [strategyToRemove.name]: _, ...restStrategyParams } = allStrategyParams;

            return ({
                ...prevConfigs,
                "strategies": {
                    ...strategies,
                    "all_strategy_params": restStrategyParams
                }
            });
        });
    }

    return (
        <div className="selected-container">
            <div
                ref={drop}
                className="all-dropped-container"
            >
                {selectedStrategies.length === 0 ? (
                    <p>Drag and drop strategies here</p>
                ) : (
                    selectedStrategies.map((droppedStrategy) => {
                        return (
                            <div key={droppedStrategy.name}
                                className="single-dropped-container">
                                <div className="dropped-name">
                                    {droppedStrategy.label}
                                </div>
                                <button
                                    onClick={() => handleRemove(droppedStrategy)}
                                >Remove Strategy
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
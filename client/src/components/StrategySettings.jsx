import { useState, useContext, createContext } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { StrategyNames, StrategyParametersConfig } from "../configs/StrategySettingsConfig";

const SelectedStrategiesContext = createContext();

function SelectedStrategiesProvider({ children }) {
    const [selectedStrategies, setSelectedStrategies] = useState([]);

    return (
        <SelectedStrategiesContext.Provider value={{ selectedStrategies, setSelectedStrategies }}>
            {children}
        </SelectedStrategiesContext.Provider>
    );
}

function UseSelectedStrategies() {
    return (useContext(SelectedStrategiesContext));
}

function AvailableStrategies() {
    return (
        <div>
            {StrategyNames.map((strategy) => {
                return (
                    <div key={strategy.name}>
                        <DraggableStrategy strategy={strategy} />
                    </div>
                );
            })}
        </div>
    );
}

function DraggableStrategy({ strategy }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "STRATEGY",
        item: strategy,
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }));

    return (
        <div
            ref={drag}
            name={strategy.name}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: "move"
            }}>
            <div>{strategy.label}</div>
            <div
                style={{ visibility: "hidden" }}
            >{strategy.description}
            </div>
        </div>
    );
}

function SelectedStrategiesBlock() {
    const { selectedStrategies, setSelectedStrategies } = UseSelectedStrategies();

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "STRATEGY",
        drop: (strategy) => {
            setSelectedStrategies((prevStrategies) => {
                if (!prevStrategies.some(
                    (elem) => elem.name === strategy.name)) {
                    return ([...prevStrategies, strategy]);
                }
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
    }

    return (
        <>
            <h2>My Strategies</h2>
            <div
                ref={drop}
                style={{
                    backgroundColor: isOver ? 'lightgreen' : 'black'
                }}>
                {selectedStrategies.length === 0 ? (
                    <p>Drag and drop strategies here</p>
                ) : (
                    selectedStrategies.map((droppedStrategy) => {
                        return (
                            <div key={droppedStrategy.name}>
                                <div>
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
        </>
    );
}

function AllRequiredParamsBlock() {
    const { selectedStrategies, _ } = UseSelectedStrategies();

    return (
        <div>
            {selectedStrategies.map((strategy) => {
                return (
                    <div key={strategy.name}>
                        <RequiredParams strategy={strategy} />
                    </div>
                );
            })}
        </div>
    );
}

function RequiredParams({ strategy }) {
    const foundStrategy = StrategyParametersConfig.find(
        (strategyParam) => strategyParam.name === strategy.name
    );

    if (!foundStrategy) {
        return;
    }

    const params = foundStrategy.params;

    return (
        <>
            <div>Parameters for {strategy.label}</div>
            {params.map((param) => {
                return (
                    <div key={param.name}>
                        <div key={param.name}>
                            {param.label}
                        </div>
                        <input
                            name={param.name}
                            type="number"
                            step={param.type === "float" ? 0.01 : 1}
                            defaultValue={param.defaultValue}
                        />
                    </div>
                );
            })}
        </>
    );
}

export function StrategySettings() {
    return (
        <DndProvider backend={HTML5Backend}>
            <SelectedStrategiesProvider>
                <AvailableStrategies />
                <SelectedStrategiesBlock />
                <AllRequiredParamsBlock />
            </ SelectedStrategiesProvider>
        </DndProvider>
    );
}
import { useState, useContext, createContext } from "react";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { SignalNames, SignalParametersConfig } from "../configs/SignalSettingsConfig";

const SelectedSignalsContext = createContext();

export function SelectedSignalsProvider({ children }) {
    const [selectedSignals, setSelectedSignals] = useState([]);

    return (
        <SelectedSignalsContext.Provider value={{ selectedSignals, setSelectedSignals }}>
            {children}
        </SelectedSignalsContext.Provider>
    );
}

export function UseSelectedSignals() {
    return useContext(SelectedSignalsContext);
}

function AvailableSignals() {
    return (
        <div>
            {SignalNames.map((signal) => {
                return (
                    <div key={signal.name}>
                        <DraggableSignal signal={signal} />
                    </div>
                );
            })}
        </div>
    )
}

function DraggableSignal({ signal }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "SIGNAL",
        item: signal,
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }));

    return (
        <div
            ref={drag}
            name={signal.name}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: "move"
            }}>
            <div>{signal.label}</div>
            <div 
                style={{ visibility: "hidden" }}
                >{signal.description}
            </div>
        </div>
    );
}

export function SelectedSignalsBlock() {
    const { selectedSignals, setSelectedSignals } = UseSelectedSignals();

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "SIGNAL",
        drop: (signal) => {
            setSelectedSignals((prevSignals) => {
                if (!selectedSignals.some(
                        (elem) => elem.name === signal.name)) {
                    return ([...prevSignals, signal]);
                }
            });
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    }));

    function handleRemove(signalToRemove) {
        const newSignals = selectedSignals.filter(
            (signal) => signal.name !== signalToRemove.name
        );
        setSelectedSignals(newSignals);
    }

    return (
        <>
            <h2>My Signals</h2>
            <div
                ref={drop}
                style={{
                    backgroundColor: isOver ? 'lightgreen' : 'black'
                }}>
                {selectedSignals.length === 0 ? (
                    <p>Drag and drop signals here</p>
                ) : (
                    selectedSignals.map((droppedSignal) => {
                        return (
                            <div key={droppedSignal.name}>
                                <div>
                                    {droppedSignal.label}
                                </div>
                                <button
                                    onClick={() => handleRemove(droppedSignal)}
                                >Remove Signal
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
    const { selectedSignals, _ } = UseSelectedSignals();

    return (
        <div>
            {selectedSignals.map((signal) => {
                return (
                    <div key={signal.name}>
                        <RequiredParams signal={signal} />
                    </div>
                );
            })}
        </div>
    );
}

function RequiredParams({ signal }) {
    const foundSignal = SignalParametersConfig.find(
        (signalParam) => signalParam.name === signal.name
    );

    const params = foundSignal ? foundSignal.params : [];

    return (
        <>
            <div>Parameters for {signal.label}</div>
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

export function SignalSettings() {
    return (
        <DndProvider backend={HTML5Backend}>
            <SelectedSignalsProvider>
                <AvailableSignals />
                <SelectedSignalsBlock />
                <AllRequiredParamsBlock />
            </ SelectedSignalsProvider>
        </DndProvider>
    );
}


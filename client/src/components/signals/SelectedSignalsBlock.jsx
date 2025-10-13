import "../Settings.css";
import { useEffect } from "react";
import { useDrop } from "react-dnd";
import { useSelectedSignals } from "../../hooks/useSelectedSignals";
import { useConfigContext } from "../../hooks/useConfigContext";

export function SelectedSignalsBlock() {
    const { selectedSignals, setSelectedSignals } = useSelectedSignals();
    const { _, setConfig } = useConfigContext();

    // Update the config everytime selectedSignals is updated
    useEffect(() => {
        const signalNames = selectedSignals.map((signal) => signal.name);
        setConfig((prevConfigs) => {
            const signals = prevConfigs.signals || {};

            return ({
                ...prevConfigs,
                "signals": {
                    ...signals,
                    "signal_names": signalNames
                }
            });
        });
    }, [selectedSignals, setConfig]);

    // Define the behaviour when items are dropped on the block
    const [, drop] = useDrop(() => ({
        accept: "SIGNAL",
        drop: (signal) => {
            setSelectedSignals((prevSignals) => {
                if (!prevSignals.some(
                    (elem) => elem.name === signal.name)) {
                    return ([...prevSignals, signal]);
                }
                return (prevSignals);
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

        setConfig((prevConfigs) => {
            const signals = prevConfigs.signals || {};
            const allSignalParams = signals.all_signal_params || {};

            const { [signalToRemove.name]: _, ...restSignalParams } = allSignalParams;

            return ({
                ...prevConfigs,
                "signals": {
                    ...signals,
                    "all_signal_params": restSignalParams
                }
            });
        });
    }

    return (
        <div className="selected-container">
            <div
                ref={drop}
                className="all-dropped-container">
                {selectedSignals.length === 0 ? (
                    <p>Drag and drop signals here</p>
                ) : (
                    selectedSignals.map((droppedSignal) => {
                        return (
                            <div key={droppedSignal.name}
                                className="single-dropped-container">
                                <div className="dropped-name">
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
        </div>
    );
}
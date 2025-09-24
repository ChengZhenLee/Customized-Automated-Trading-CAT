import { useDrop } from "react-dnd";
import { useSelectedSignals } from "../../hooks/useSelectedSignals";

export function SelectedSignalsBlock() {
    const { selectedSignals, setSelectedSignals } = useSelectedSignals();

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
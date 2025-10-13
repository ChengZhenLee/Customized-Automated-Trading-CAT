import "../Settings.css";
import { useDrag } from "react-dnd";
import { SignalNames } from "../../constants/configs/SignalSettingsConfig";

export function AvailableSignals() {
    return (
        <div className="available-container">
            {SignalNames.map((signal) => {
                return (
                    <DraggableSignal signal={signal} key={signal.name} />
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
            }}
            className="draggable">
            <div>{signal.label}</div>
            <div>
                {signal.description}
            </div>
        </div>
    );
}

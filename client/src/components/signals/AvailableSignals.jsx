import { useDrag } from "react-dnd";
import { SignalNames } from "../../constants/configs/SignalSettingsConfig";

export function AvailableSignals() {
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

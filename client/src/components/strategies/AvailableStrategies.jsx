import "../Settings.css";
import { useDrag } from "react-dnd";
import { StrategyNames } from "../../constants/configs/StrategySettingsConfig";

export function AvailableStrategies() {
    return (
        <div className="available-container">
            {StrategyNames.map((strategy) => {
                return (
                    <DraggableStrategy strategy={strategy} key={strategy.name}/>
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
            }}
            className="draggable">
            <div>{strategy.label}</div>
            <div>
                {strategy.description}
            </div>
        </div>
    );
}
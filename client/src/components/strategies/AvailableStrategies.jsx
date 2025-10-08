import { useDrag } from "react-dnd";
import { StrategyNames } from "../../constants/configs/StrategySettingsConfig";

export function AvailableStrategies() {
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
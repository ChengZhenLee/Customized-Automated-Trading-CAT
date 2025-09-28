import { useDrop } from "react-dnd";
import { useSelectedStrategies } from "../../hooks/useSelectedStrategies";

export function SelectedStrategiesBlock() {
    const { selectedStrategies, setSelectedStrategies } = useSelectedStrategies();

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
                    backgroundColor: isOver ? 'lightgreen' : 'gray'
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
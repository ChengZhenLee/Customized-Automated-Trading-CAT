import { StrategyParametersConfig } from "../../configs/StrategySettingsConfig";
import { useSelectedStrategies } from "../../hooks/useSelectedStrategies";

export function AllRequiredParamsBlock() {
    const { selectedStrategies, _ } = useSelectedStrategies();

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
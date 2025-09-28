import { StrategyParametersConfig } from "../../configs/StrategySettingsConfig";
import { useSelectedStrategies } from "../../hooks/useSelectedStrategies";

export function AllRequiredParamsBlock() {
    const { selectedStrategies, _ } = useSelectedStrategies();

    return (
        <div>
            {selectedStrategies.map((strategy) => {
                const paramsInfo = StrategyParametersConfig.find(
                    (elem) => elem.strategyName === strategy.name
                );

                if (!paramsInfo) return;

                return (
                    <div key={strategy.name}>
                        <RequiredParams paramsInfo={paramsInfo} />
                    </div>
                );
            })}
        </div>
    );
}

function RequiredParams({ paramsInfo }) {
    return (
        <>
            <div>Parameters for {paramsInfo.strategyName}</div>
            {paramsInfo.params.map((param) => {
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
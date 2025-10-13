import "../Settings.css";
import { useEffect, useRef } from "react";
import { StrategyParametersConfig } from "../../constants/configs/StrategySettingsConfig";
import { useSelectedStrategies } from "../../hooks/useSelectedStrategies";
import { useConfigContext } from "../../hooks/useConfigContext";

export function AllRequiredParamsBlock() {
    const { selectedStrategies, _ } = useSelectedStrategies();
    const { config, setConfig } = useConfigContext();

    const optimize = config.trader_settings.optimize || false;

    useEffect(() => {
        const inactiveParamsKey = optimize ? "all_strategy_params" : "all_strategy_optimize_params";

        setConfig((prevConfig) => {
            const strategies = prevConfig.strategies || {};

            return ({
                ...prevConfig,
                "strategies": {
                    ...strategies,
                    [inactiveParamsKey]: {}
                }
            });
        });
    }, [optimize, setConfig]);

    return (
        <div>
            {selectedStrategies.map((strategy) => {
                const paramsInfo = StrategyParametersConfig.find(
                    (elem) => elem.strategyName === strategy.name
                );

                if (!paramsInfo) return;

                return (
                    <div key={strategy.name} className="all-required-params-container">
                        {
                            optimize ?
                                <RequiredOptimizeParams paramsInfo={paramsInfo} /> :
                                <RequiredParams paramsInfo={paramsInfo} />
                        }
                    </div>
                );
            })}
        </div>
    );
}

function RequiredParams({ paramsInfo }) {
    const { _, setConfig } = useConfigContext();

    //Set the default configs
    useEffect(() => {
        const paramsObject = paramsInfo.params.reduce((acc, param) => {
            acc[param.name] = param.defaultValue;
            return acc;
        }, {});

        setConfig((prevConfig) => {
            const strategies = prevConfig.strategies || {};
            const allStrategyParams = strategies.all_strategy_params || {};

            return ({
                ...prevConfig,
                "strategies": {
                    ...strategies,
                    "all_strategy_params": {
                        ...allStrategyParams,
                        [paramsInfo.strategyName]: paramsObject
                    }
                }
            })
        })
    }, [setConfig, paramsInfo]);

    //Update the value of a specific param of a strategy
    function updateConfigParameters(strategyName, paramName, value) {
        setConfig((prevConfig) => {
            const strategies = prevConfig.strategies || {};
            const allStrategyParams = strategies.all_strategy_params || {};
            const strategyParams = allStrategyParams[strategyName] || {};

            return ({
                ...prevConfig,
                "strategies": {
                    ...strategies,
                    "all_strategy_params": {
                        ...allStrategyParams,
                        [strategyName]: {
                            ...strategyParams,
                            [paramName]: value
                        }
                    }
                }
            });
        });
    }

    return (
        <div className="params-settings-container">
            <div>Parameters for {paramsInfo.strategyName}</div>
            {paramsInfo.params.map((param) => {
                const strategyName = paramsInfo.strategyName;
                const paramName = param.name;

                return (
                    <div key={paramName} className="param-settings-container">
                        <div key={paramName}>
                            {param.label}
                        </div>
                        <input
                            name={paramName}
                            type="number"
                            step={param.type === "float" ? 0.01 : 1}
                            placeholder={param.placeholder ? param.placeholder : ""}
                            defaultValue={param.defaultValue}
                            onChange={(event) => {
                                updateConfigParameters(
                                    strategyName,
                                    paramName,
                                    event.target.valueAsNumber
                                );
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}

function RequiredOptimizeParams({ paramsInfo }) {
    const { config, setConfig } = useConfigContext();
    const inputRefs = useRef({});

    // Set the default configs
    useEffect(() => {
        const paramsObject = paramsInfo.params.reduce((acc, param) => {
            acc[param.name] = [param.defaultValue];
            return acc;
        }, {});

        setConfig((prevConfig) => {
            const strategies = prevConfig.strategies || {};
            const allStrategyOptimizeParams = strategies.all_strategy_params || {};

            return ({
                ...prevConfig,
                "strategies": {
                    ...strategies,
                    "all_strategy_optimize_params": {
                        ...allStrategyOptimizeParams,
                        [paramsInfo.strategyName]: paramsObject
                    }
                }
            });
        });

        paramsInfo.params.forEach((param) => {
            inputRefs.current[param.name] = param.defaultValue;
        });
    }, [setConfig, paramsInfo]);

    //Add a value to the array of a param
    function addValueToParamArray(strategyName, paramName, value) {
        setConfig((prevConfig) => {
            const strategies = prevConfig.strategies || {};
            const allStrategyOptimizeParams = strategies.all_strategy_optimize_params || {};
            const strategyOptimizeParams = allStrategyOptimizeParams[strategyName] || {};
            const oldParam = strategyOptimizeParams[paramName] || [];

            const exists = oldParam.some((item) => item === value);

            if (exists) {
                return (prevConfig);
            }

            const newParam = [...oldParam, value];

            return ({
                ...prevConfig,
                "strategies": {
                    ...strategies,
                    "all_strategy_optimize_params": {
                        ...allStrategyOptimizeParams,
                        [strategyName]: {
                            ...strategyOptimizeParams,
                            [paramName]: newParam
                        }
                    }
                }
            });
        });
    }

    //Clear the array of a param
    function clearParamArray(strategyName, paramName) {
        setConfig((prevConfig) => {
            const strategies = prevConfig.strategies || {};
            const allStrategyOptimizeParams = strategies.all_strategy_optimize_params || {};
            const strategyOptimizeParams = allStrategyOptimizeParams[strategyName] || {};

            return ({
                ...prevConfig,
                "strategies": {
                    ...strategies,
                    "all_strategy_optimize_params": {
                        ...allStrategyOptimizeParams,
                        [strategyName]: {
                            ...strategyOptimizeParams,
                            [paramName]: []
                        }
                    }
                }
            });
        });
    }

    // Gets the array of values for a specific param of a strategy
    function getParamValues(strategyName, paramName) {
        return config.strategies?.all_strategy_optimize_params?.[strategyName]?.[paramName] || [];
    }

    return (
        <div className="params-settings-container">
            <div>Parameters for {paramsInfo.strategyName}</div>
            {paramsInfo.params.map((param) => {
                const strategyName = paramsInfo.strategyName;
                const paramName = param.name;
                const currentValues = getParamValues(strategyName, paramName);

                return (
                    <div key={paramName}>
                        <div key={paramName} className="param-settings-container">
                            {param.label}
                        </div>
                        <input
                            name={paramName}
                            type="number"
                            step={param.type === "float" ? 0.01 : 1}
                            placeholder={param.placeholder ? param.placeholder : ""}
                            defaultValue={param.defaultValue}
                            onChange={
                                (event) => {
                                    if (isNaN(event.target.valueAsNumber)) return;
                                    inputRefs.current[paramName] = event.target.valueAsNumber;
                                }
                            }
                        />
                        <button
                            onClick={() => {
                                const value = inputRefs.current[param.name];
                                addValueToParamArray(strategyName, paramName, value);
                            }}>Add
                        </button>

                        <button
                            onClick={() => {
                                clearParamArray(strategyName, paramName);
                            }}>Clear
                        </button>

                        <div>
                            Selected Values: {currentValues.join(', ')}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
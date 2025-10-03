import { useEffect, useRef } from "react";
import { SignalParametersConfig } from "../../configs/SignalSettingsConfig";
import { useSelectedSignals } from "../../hooks/useSelectedSignals";
import { useConfigContext } from "../../hooks/useConfigContext";

export function AllRequiredParamsBlock() {
    const { selectedSignals, _ } = useSelectedSignals();
    const { config, setConfig } = useConfigContext();

    const optimize = config.trader_settings.optimize || false;

    useEffect(() => {
        const inactiveParamsKey = optimize ? "all_signal_params" : "all_signal_optimize_params";

        setConfig((prevConfig) => {
            const signals = prevConfig.signals || {};

            return ({
                ...prevConfig,
                "signals": {
                    ...signals,
                    [inactiveParamsKey]: {}
                }
            });
        });
    }, [optimize, setConfig]);

    return (
        <div>
            {selectedSignals.map((signal) => {
                const paramsInfo = SignalParametersConfig.find(
                    (elem) => elem.signalName === signal.name
                );

                if (!paramsInfo) return;

                return (
                    <div key={signal.name}>
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

    // Set the default configs
    useEffect(() => {
        const paramsObject = paramsInfo.params.reduce((acc, param) => {
            acc[param.name] = param.defaultValue;
            return acc;
        }, {});

        setConfig((prevConfig) => {
            const signals = prevConfig.signals || {};
            const allSignalParams = signals.all_signal_params || {};

            return ({
                ...prevConfig,
                "signals": {
                    ...signals,
                    "all_signal_params": {
                        ...allSignalParams,
                        [paramsInfo.signalName]: paramsObject
                    }
                }
            });
        })
    }, [setConfig, paramsInfo]);


    // Update the value of a specific param of a signal
    function updateConfigParameters(signalName, paramName, value) {
        setConfig((prevConfig) => {
            const signals = prevConfig.signals || {};
            const allSignalParams = signals.all_signal_params || {};
            const signalParams = allSignalParams[signalName] || {};

            return ({
                ...prevConfig,
                "signals": {
                    ...signals,
                    "all_signal_params": {
                        ...allSignalParams,
                        [signalName]: {
                            ...signalParams,
                            [paramName]: value
                        }
                    }
                }
            });
        });
    }

    return (
        <>
            <div>Parameters for {paramsInfo.signalName}</div>
            {paramsInfo.params.map((param) => {
                const signalName = paramsInfo.signalName;
                const paramName = param.name

                return (
                    <div key={paramName}>
                        <div key={paramName}>
                            {param.label}
                        </div>
                        <input
                            name={paramName}
                            type="number"
                            step={param.type === "float" ? 0.01 : 1}
                            defaultValue={param.defaultValue}
                            onChange={(event) => {
                                updateConfigParameters(
                                    signalName,
                                    paramName,
                                    event.target.valueAsNumber
                                );
                            }}
                        />
                    </div>
                );
            })}
        </>
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
            const signals = prevConfig.signals || {};
            const allSignalOptimizeParams = signals.all_signal_optimize_params || {};

            return ({
                ...prevConfig,
                "signals": {
                    ...signals,
                    "all_signal_optimize_params": {
                        ...allSignalOptimizeParams,
                        [paramsInfo.signalName]: paramsObject
                    }
                }
            });
        });

        paramsInfo.params.forEach((param) => {
            inputRefs.current[param.name] = param.defaultValue;
        });
    }, [setConfig, paramsInfo]);

    //Add a value to the array of a param
    function addValueToParamArray(signalName, paramName, value) {
        setConfig((prevConfig) => {
            const signals = prevConfig.signals || {};
            const allSignalOptimizeParams = signals.all_signal_optimize_params || {};
            const signalOptimizeParams = allSignalOptimizeParams[signalName] || {};
            const oldParam = signalOptimizeParams[paramName] || [];

            const exists = oldParam.some((item) => item === value);

            if (exists) {
                return (prevConfig);
            }

            const newParam = [...oldParam, value];

            return ({
                ...prevConfig,
                "signals": {
                    ...signals,
                    "all_signal_optimize_params": {
                        ...allSignalOptimizeParams,
                        [signalName]: {
                            ...signalOptimizeParams,
                            [paramName]: newParam
                        }
                    }
                }
            });
        });
    }

    //Clear the array of a param
    function clearParamArray(signalName, paramName) {
        setConfig((prevConfig) => {
            const signals = prevConfig.signals || {};
            const allSignalOptimizeParams = signals.all_signal_optimize_params || {};
            const signalOptimizeParams = allSignalOptimizeParams[signalName] || {};

            return ({
                ...prevConfig,
                "signals": {
                    ...signals,
                    "all_signal_optimize_params": {
                        ...allSignalOptimizeParams,
                        [signalName]: {
                            ...signalOptimizeParams,
                            [paramName]: []
                        }
                    }
                }
            });
        });
    }

    function getParamValues(signalName, paramName) {
        return config?.signals?.all_signal_optimize_params?.[signalName]?.[paramName] || [];
    }

    return (
        <>
            <div>Parameters for {paramsInfo.signalName}</div>
            {paramsInfo.params.map((param) => {
                const signalName = paramsInfo.signalName;
                const paramName = param.name;
                const currentValues = getParamValues(signalName, paramName);

                return (
                    <div key={paramName}>
                        <div key={paramName}>
                            {param.label}
                        </div>
                        <input
                            name={paramName}
                            type="number"
                            step={param.type === "float" ? 0.01 : 1}
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
                                addValueToParamArray(signalName, paramName, value);
                            }}>Add
                        </button>

                        <button
                            onClick={() => {
                                clearParamArray(signalName, paramName);
                            }}>Clear
                        </button>

                        <div>
                            Selected Values: {currentValues.join(', ')}
                        </div>
                    </div>
                );
            })}
        </>
    );
}
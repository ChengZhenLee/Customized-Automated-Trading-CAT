import { SignalParametersConfig } from "../../configs/SignalSettingsConfig";
import { useSelectedSignals } from "../../hooks/useSelectedSignals";
import { useConfigContext } from "../../hooks/useConfigContext";

export function AllRequiredParamsBlock() {
    const { selectedSignals, _ } = useSelectedSignals();

    return (
        <div>
            {selectedSignals.map((signal) => {
                const paramsInfo = SignalParametersConfig.find(
                    (elem) => elem.signalName === signal.name
                );

                if (!paramsInfo) return;

                return (
                    <div key={signal.name}>
                        <RequiredParams paramsInfo={paramsInfo} />
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
            const allSignalParameters = signals.all_signal_parameters || {};

            return ({
                ...prevConfig,
                "signals": {
                    ...signals,
                    all_signal_parameters: {
                        ...allSignalParameters,
                        [paramsInfo.signalName]: paramsObject
                    }
                }
            });
        })
    }, []);


    // Update the value of a specific param of a signal
    function updateConfigParameters(signalName, paramName, value) {
        setConfig((prevConfig) => {
            const signals = prevConfig.signals || {};
            const allSignalParameters = signals.all_signal_parameters || {};
            const signalParams = allSignalParameters[signalName] || {};

            return ({
                ...prevConfig,
                "signals": {
                    ...signals,
                    all_signal_parameters: {
                        ...allSignalParameters,
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
                            onChange={(event) => {
                                updateConfigParameters(
                                    paramsInfo.signalName,
                                    param.name,
                                    event.target.value
                                )
                            }}
                        />
                    </div>
                );
            })}
        </>
    );
}
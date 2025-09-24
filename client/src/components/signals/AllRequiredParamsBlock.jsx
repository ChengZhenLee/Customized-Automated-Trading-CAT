import { SignalParametersConfig } from "../../configs/SignalSettingsConfig";
import { useSelectedSignals } from "../../hooks/useSelectedSignals";

export function AllRequiredParamsBlock() {
    const { selectedSignals, _ } = useSelectedSignals();

    return (
        <div>
            {selectedSignals.map((signal) => {
                return (
                    <div key={signal.name}>
                        <RequiredParams signal={signal} />
                    </div>
                );
            })}
        </div>
    );
}

function RequiredParams({ signal }) {
    const foundSignal = SignalParametersConfig.find(
        (signalParam) => signalParam.name === signal.name
    );

    const params = foundSignal ? foundSignal.params : [];

    return (
        <>
            <div>Parameters for {signal.label}</div>
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
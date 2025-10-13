import "./SignalSettings.css";
import { SelectedSignalsProvider } from "../provider/SelectedSignalsProvider";
import { AvailableSignals } from "./AvailableSignals";
import { SelectedSignalsBlock } from "./SelectedSignalsBlock";
import { AllRequiredParamsBlock } from "./AllRequiredParamsBlock";

export function SignalSettings() {
    return (
        <SelectedSignalsProvider>
            <div className="signal-settings-container">
                <AvailableSignals />
                <SelectedSignalsBlock />
                <AllRequiredParamsBlock />
            </div>
        </ SelectedSignalsProvider>
    );
}


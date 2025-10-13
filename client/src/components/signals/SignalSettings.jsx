import "../Settings.css";
import { SelectedSignalsProvider } from "../provider/SelectedSignalsProvider";
import { AvailableSignals } from "./AvailableSignals";
import { SelectedSignalsBlock } from "./SelectedSignalsBlock";
import { AllRequiredParamsBlock } from "./AllRequiredParamsBlock";

export function SignalSettings() {
    return (
        <SelectedSignalsProvider>
            <div className="signals-strategies-settings-container">
                <AvailableSignals />
                <SelectedSignalsBlock />
                <AllRequiredParamsBlock />
            </div>
        </ SelectedSignalsProvider>
    );
}


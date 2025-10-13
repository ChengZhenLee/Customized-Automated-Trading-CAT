import "../Settings.css";
import { SelectedStrategiesProvider } from "../provider/SelectedStrategiesProvider";
import { AvailableStrategies } from "./AvailableStrategies";
import { SelectedStrategiesBlock } from "./SelectedStrategiesBlock";
import { AllRequiredParamsBlock } from "../strategies/AllRequiredParamsBlock";

export function StrategySettings() {
    return (
        <SelectedStrategiesProvider>
            <div className="signals-strategies-settings-container">
                <AvailableStrategies />
                <SelectedStrategiesBlock />
                <AllRequiredParamsBlock />
            </div>
        </ SelectedStrategiesProvider>
    );
}
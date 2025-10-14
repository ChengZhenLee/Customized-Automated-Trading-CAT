import { SelectedStrategiesProvider } from "../provider/SelectedStrategiesProvider";
import { AvailableStrategies } from "./AvailableStrategies";
import { SelectedStrategiesBlock } from "./SelectedStrategiesBlock";
import { AllRequiredParamsBlock } from "../strategies/AllRequiredParamsBlock";

export function StrategySettings() {
    return (
        <SelectedStrategiesProvider>
            <AvailableStrategies />
            <SelectedStrategiesBlock />
            <AllRequiredParamsBlock />
        </ SelectedStrategiesProvider>
    );
}
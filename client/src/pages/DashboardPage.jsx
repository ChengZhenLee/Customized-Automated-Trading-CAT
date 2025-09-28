import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Header } from "../components/Header";
import { DataSettings } from "../components/data-settings/DataSettings";
import { TraderSettings } from "../components/trader-settings/TraderSettings";
import { SignalSettings } from "../components/signals/SignalSettings";
import { StrategySettings } from "../components/strategies/StrategySettings";
import { ConfigContextProvider } from "../components/provider/ConfigContextProvider";

export function DashboardPage() {
    return (
        <>
            <Header />

            <ConfigContextProvider>
                <DataSettings />
                <TraderSettings />

                <DndProvider backend={HTML5Backend}>
                    <SignalSettings />
                    <StrategySettings />
                </DndProvider>
            </ConfigContextProvider>
        </>
    );
}
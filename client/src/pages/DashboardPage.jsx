import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Header } from "../components/Header";
import { DataSettings } from "../components/DataSettings";
import { TraderSettings } from "../components/TraderSettings";
import { SignalSettings } from "../components/signals/SignalSettings";
import { StrategySettings } from "../components/strategies/StrategySettings";

// implement master context here to store the configs for saving and sending to backend

export function DashboardPage() {
    return (
        <>
            <Header />
            <DataSettings />
            <TraderSettings />

            <DndProvider backend={HTML5Backend}>
                <SignalSettings />
                <StrategySettings />
            </DndProvider>

            <p>Dashboard</p>
        </>
    );
}
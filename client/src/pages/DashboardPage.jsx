import { Header } from "../components/Header";
import { DataSettings } from "../components/DataSettings";
import { TraderSettings } from "../components/TraderSettings";
import { SignalSettings } from "../components/SignalSettings";
import { StrategySettings } from "../components/StrategySettings";

export function DashboardPage() {
    return (
        <>
            <Header />
            <DataSettings />
            <TraderSettings />
            <SignalSettings />
            <StrategySettings />
            <p>Dashboard</p>
        </>
    );
}
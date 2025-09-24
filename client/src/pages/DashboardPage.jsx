import { Header } from "../components/Header";
import { DataSettings } from "../components/DataSettings";
import { TraderSettings } from "../components/TraderSettings";
import { SignalSettings } from "../components/SignalSettings";

export function DashboardPage() {
    return (
        <>
            <Header />
            <DataSettings />
            <TraderSettings />
            <SignalSettings />
            <p>Dashboard</p>
        </>
    );
}
import { useEffect } from "react";
import { TraderSettingsConfig } from "../../constants/configs/TraderSettingsConfig"
import { SingleTraderSetting } from "./SingleTraderSetting";
import { useConfigContext } from "../../hooks/useConfigContext";

export function TraderSettings() {
    const { _, setConfig } = useConfigContext();

    useEffect(() => {
        const defaultTraderSettings = TraderSettingsConfig.reduce((acc, setting) => {
            const value = setting.type === "bool" ? 
                setting.defaultChecked : 
                setting.defaultValue;
            acc[setting.name] = value;
            return acc;
        }, {});

        setConfig((prevSettings) => ({
            ...prevSettings,
            "trader_settings": defaultTraderSettings
        }));
    }, [setConfig]);

    return (
        <form>
            {TraderSettingsConfig.map((setting) => {
                return (
                    <div key={setting.name}>
                        <SingleTraderSetting setting={setting} />
                    </div>
                );
            })}
        </form>
    );
}
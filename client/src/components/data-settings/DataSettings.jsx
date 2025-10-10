import "./DataSettings.css";
import { useEffect } from "react";
import { DataSettingsConfig } from "../../constants/configs/DataSettingsConfig";
import { SingleDataSetting } from "./SingleDataSetting";
import { useConfigContext } from "../../hooks/useConfigContext";

export function DataSettings() {
    const { _, setConfig } = useConfigContext();

    useEffect(() => {
        const defaultDataSettings = DataSettingsConfig.reduce((acc, setting) => {
            const value = setting.type === "date" ?
                null :
                setting.defaultValue || setting.defaultOption;
            acc[setting.name] = value;
            return acc;
        }, {});

        setConfig((prevSettings) => ({
            ...prevSettings,
            "data_settings": defaultDataSettings
        }));
    }, [setConfig]);

    return (
        <div className="data-settings-container">
            {DataSettingsConfig.map((setting) => {
                return (
                    <div className="data-setting-container" key={setting.name}>
                        <SingleDataSetting setting={setting} />
                    </div>
                );
            })}
        </div>
    )
}
import { useEffect } from "react";
import { DataSettingsConfig } from "../../configs/DataSettingsConfig";
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
        <>
            {DataSettingsConfig.map((setting) => {
                return (
                    <div key={setting.name}>
                        <SingleDataSetting setting={setting} />
                    </div>
                );
            })}
        </>
    )
}
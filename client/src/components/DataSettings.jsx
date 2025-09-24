import { Fragment } from "react";
import { DataSettingsConfig } from "../configs/DataSettingsConfig";

function renderDataSetting(setting) {
    switch (setting.type) {
        case "string":
            return (
                <>
                    <p>{setting.label}</p>
                    <input
                        name={setting.name}
                        type="text"
                        defaultValue={setting.defaultValue}
                    />
                </>
            );

        case "timeframe":
            return (
                <>
                    <p>{setting.label}</p>
                    <div >
                        {setting.options.map((option) => {
                            const defaultChecked = option === setting.defaultOption;

                            return (
                                <Fragment key={option}>
                                    <input
                                        type="radio"
                                        name={setting.name}
                                        value={option}
                                        id={`${setting.name}-${option}`}
                                        defaultChecked={defaultChecked}
                                    />
                                    <label 
                                        htmlFor={`${setting.name}-${option}`}>
                                        {option}
                                    </label>
                                </Fragment>
                            );
                        })}
                    </div>
                </>
            );

        case "date":
            return (
                <>
                    <p>{setting.label}</p>
                    <input
                        name={setting.name}
                        type="date"
                    />
                </>
            );
    }
}

export function DataSettings() {
    return (
        <>
            {DataSettingsConfig.map((setting) => {
                return (
                    <div key={setting.name}>
                        {renderDataSetting(setting)}
                    </div>
                );
            })}
        </>
    )
}
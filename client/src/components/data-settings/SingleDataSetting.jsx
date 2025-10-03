import { useConfigContext } from "../../hooks/useConfigContext";

export function SingleDataSetting({ setting }) {
    const { _, setConfig } = useConfigContext();

    function handleInput(settingName, value, type) {
        setConfig((prevConfig) => {
            const dataSettings = prevConfig.data_settings || {};

            if (type === "date") {
                const date = value.split("-");

                return ({
                    ...prevConfig,
                    "data_settings": {
                        ...dataSettings,
                        [settingName]: {
                            year: Number(date[0]),
                            month: Number(date[1]),
                            day: Number(date[2])
                        }
                    }
                });
            } else {
                return ({
                    ...prevConfig,
                    "data_settings": {
                        ...dataSettings,
                        [settingName]: value
                    }
                })
            }
        });
    }
    
    switch (setting.type) {
        case "string":
            return (
                <div>
                    <p>{setting.label}</p>
                    <input
                        name={setting.name}
                        type="text"
                        defaultValue={setting.defaultValue}
                        onChange={(event)=>{
                            handleInput(setting.name, event.target.value, event.target.type)
                        }}
                    />
                </div>
            );

        case "timeframe":
            return (
                <div>
                    <p>{setting.label}</p>
                    <div >
                        {setting.options.map((option) => {
                            const defaultChecked = option === setting.defaultOption;

                            return (
                                <div key={option}>
                                    <input
                                        type="radio"
                                        name={setting.name}
                                        value={option}
                                        id={`${setting.name}-${option}`}
                                        defaultChecked={defaultChecked}
                                        onChange={(event)=>{
                                            handleInput(setting.name, event.target.value, event.target.type)
                                        }}
                                    />
                                    <label 
                                        htmlFor={`${setting.name}-${option}`}>
                                        {option}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );

        case "date":
            return (
                <div>
                    <p>{setting.label}</p>
                    <input
                        name={setting.name}
                        type="date"
                        onChange={(event)=>{
                            handleInput(setting.name, event.target.value, event.target.type)
                        }}
                    />
                </div>
            );
    }
}
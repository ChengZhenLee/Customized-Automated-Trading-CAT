import { useConfigContext } from "../../hooks/useConfigContext";

export function SingleTraderSetting({ setting }) {
    const { _, setConfig } = useConfigContext();

    function handleInput(settingName, value) {
        setConfig((prevConfig) => ({
            ...prevConfig,
            "trader_settings": {
                ...prevConfig.trader_settings,
                [settingName]: value
            }
        }));
    }

    switch (setting.type) {
        case "float":
        case "int":
            return (
                <div>
                    <p>{setting.label}</p>
                    <input
                        name={setting.name}
                        type="number"
                        inputMode="decimal"
                        placeholder={setting.placeholder}
                        defaultValue={setting.defaultValue}
                        step={setting.type === "float" ? "0.01" : "1"}
                        onChange={(event) => {
                            handleInput(setting.name, event.target.valueAsNumber);
                        }}
                    />
                </div>

            );

        case "bool":
            return (
                <div>
                    <p>{setting.label}</p>
                    <input
                        name={setting.name}
                        type="checkbox"
                        defaultChecked={setting.defaultChecked}
                        onChange={(event) => {
                            handleInput(setting.name, event.target.checked);
                        }}
                    />
                </div>
            );

        default:
            return (null);
    }
}
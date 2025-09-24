import { TraderSettingsConfig } from "../configs/TraderSettingsConfig"

function renderTraderSetting(setting) {
    switch (setting.type) {
        case "float":
        case "int":
            return (
                <>
                    <p>{setting.label}</p>
                    <input
                        name={setting.name}
                        type="number"
                        inputMode="decimal"
                        placeholder={setting.placeholder}
                        defaultValue={setting.defaultValue}
                        step={setting.type === "float" ? "0.01" : "1"}
                    />
                </>

            );

        case "bool":
            return (
                <>
                    <p>{setting.label}</p>
                    <input
                        name={setting.name}
                        type="checkbox"
                        defaultChecked={setting.defaultChecked}
                    />
                </>
            );

        default:
            return (null);
    }
}

export function TraderSettings() {
    return (
        <form>
            {TraderSettingsConfig.map((setting) => {
                return (
                    <div key={setting.name}>
                        {renderTraderSetting(setting)}
                    </div>
                );
            })}
        </form>
    );
}
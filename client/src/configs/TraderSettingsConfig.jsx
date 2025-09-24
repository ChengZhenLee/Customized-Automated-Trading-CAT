export const TraderSettingsConfig = [
    {
        name: "starting_cash",
        type: "float",
        label: "Starting Cash",
        placeholder: "starting cash for backtesting",
        defaultValue: "100000"
    },

    {
        name: "commission",
        type: "float",
        label: "Broker Commission Percentage",
        placeholder: "e.g. 0.01 for 1%",
        defaultValue: "0.0"
    },

    {
        name: "optimize",
        type: "bool",
        label: "Optimize Parameters",
        defaultChecked: false
    },

    {
        name: "plot",
        type: "bool",
        label: "Show Backtest Plot",
        defaultChecked: true
    },

    {
        name: "size",
        type: "int",
        label: "Position Size",
        defaultValue: "1",
        description: "The number of shares to trade per position"
    }
];
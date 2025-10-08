export const DataSettingsConfig = [
    {
        name: "symbols_to_trade",
        type: "string",
        label: "Stock Symbol",
        defaultValue: "AAPL"
    },

    {
        name: "timeframe",
        type: "timeframe",
        label: "Trading Timeframe",
        options: ["Min", "Hour", "Day", "Week", "Month"],
        defaultOption: "Day"
    },

    {
        name: "start_time",
        type: "date",
        label: "Start Date"
    },

    {
        name: "end_time",
        type: "date",
        label: "Start Date"
    }
];
export const StrategyNames = [
    {
        name: "single",
        label: "Single Position Strategy",
        description: "Strategy that holds only a single position at a time"
    },

    {
        name: "dca",
        label: "Dollar Cost Averaging Strategy",
        description: "Strategy that holds multiple positions at a time"
    },

    {
        name: "duration",
        label: "Duration in Position Strategy",
        description: "Strategy that is only in a position for a certain duration"
    },

    {
        name: "pricediff",
        label: "Price Difference Strategy",
        description: "Strategy that enters or exits a position depending on the relative price difference from a previous order"
    }
]

export const StrategyParametersConfig = [
    {
        strategyName: "duration",
        params: [
            {
                name: "duration",
                label: "Duration in Position",
                type: "int",
                defaultValue: 50
            }
        ]
    },

    {
        strategyName: "pricediff",
        params: [
            {
                name: "initial_entry_price",
                label: "Initial Entry Price",
                type: "float",
                defaultValue: 100.0,
                placeholder: "Input a stock price"
            },

            {
                name: "price_drop_pct",
                label: "Price Drop in Percentage",
                type: "float",
                defaultValue: 0.20,
                placeholder: "e.g. 0.20 is 20%"
            },

            {
                name: "price_rise_pct",
                label: "Price Rise in Percentage",
                type: "float",
                defaultValue: 0.20,
                placeholder: "e.g. 0.20 is 20%"
            }
        ]
    }
]
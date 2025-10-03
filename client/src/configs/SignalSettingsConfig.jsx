export const SignalNames = [
    {
        name: "sma",
        label: "Simple Moving Average Crossover Signal",
        description: "Signal based on the crossover of two simple moving averages"
    },

    {
        name: "rsi",
        label: "Relative Strength Index (RSI) Signal",
        description: "Signal based on RSI levels"
    },

    {
        name: "pricediff",
        label: "Price Difference Signal",
        description: "Signal based on percentage price difference from a previous position"
    }
]

export const SignalParametersConfig = [
    {
        signalName: "sma",
        params: [
            {
                name: "fast",
                label: "Fast Moving Average",
                type: "int",
                defaultValue: 50
            },
            {
                name: "slow",
                label: "Slow Moving Average",
                type: "int",
                defaultValue: 200
            }
        ]
    },

    {
        signalName: "rsi",
        params: [
            {
                name: "period",
                label: "RSI Period",
                type: "int",
                defaultValue: 12
            },

            {
                name: "overbought",
                label: "RSI Overbought Level",
                type: "float",
                defaultValue: 70.0
            },

            {
                name: "oversold",
                label: "RSI Oversold Level",
                type: "float",
                defaultValue: 30.0
            }
        ]
    },

    {
        signalName: "pricediff",
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
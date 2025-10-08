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
    }
]
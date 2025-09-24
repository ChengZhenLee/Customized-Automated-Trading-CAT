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
    }
]

export const StrategyParametersConfig = [
    {
        name: "duration",
        params: [
            {
                name: "duration",
                label: "Duration in Position",
                type: "int",
                defaultValue: 50
            }
        ]
    }
]
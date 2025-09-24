export const StrategyNames = {
    "single": {
        label: "Single Position Strategy",
        description: "Strategy that holds only a single position at a time"
    },

    "dca": {
        label: "Dollar Cost Averaging Strategy",
        description: "Strategy that holds multiple positions at a time"
    },

    "duration": {
        label: "Duration in Position Strategy",
        description: "Strategy that is only in a position for a certain duration"
    }
}

export const StrategyParametersConfig = {
    "duration": {
        "duration": {
            label: "Duration in Position",
            type: "int",
            defaultValue: 50
        }
    }
}
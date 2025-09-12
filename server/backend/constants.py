ALPACA_API_KEYS = "../keys.json"

DATA_SETTINGS_STRUCTURE = {
    "symbols_to_trade", "time_frame", "start_time", "end_time"
}

TRADER_SETTINGS_STRUCTURE = {
    "starting_cash", "commission", "optimize", "plot", "size"
}

SIGNAL_PARAMS = {
    "sma": {"fast", "slow"},
    "rsi": {"period", "overbought", "oversold"},
    "pricediff": {"price_drop_pct", "price_rise_pct", "initial_entry_price"}
}

STRATEGIES = {
    "single", "dca", "duration"
}

STRATEGY_PARAMS = {
    "duration": {"duration"}
}
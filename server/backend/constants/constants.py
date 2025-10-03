ALPACA_API_KEYS = "keys.json"

REDIS_URL = "redis://localhost:6379"

RUNS_DIR = "backtest_runs"

TRADER_SETTINGS_FILE = "trader_settings.json"

DATA_SETTINGS_FILE = "data_settings.json"

SIGNALS_FILE = "signals.json"

STRATEGIES_FILE = "strategies.json"

LOG_FILE = "results.txt"

PLOT_FILE = "plot.png"

TRADER_SETTINGS_STRUCTURE = {
    "starting_cash": float, 
    "commission": float, 
    "optimize": bool, 
    "plot": bool, 
    "size": int
}

DATA_SETTINGS_STRUCTURE = {
    "symbols_to_trade": str, 
    "timeframe": str, 
    "start_time": {"year": int, "month": int, "day": int}, 
    "end_time": {"year": int, "month": int, "day": int}
}

SIGNALS_STRUCTURE = {
    "signal_names": {"sma", "rsi", "pricediff"},

    "all_signal_params": {
        "sma": {"fast": int, "slow": int},
        "rsi": {"period": int, "overbought": float, "oversold": float},
        "pricediff": {"price_drop_pct": float, "price_rise_pct": float, "initial_entry_price": float}
    },

    "all_signal_optimize_params": {
        "sma": {"fast": [int], "slow": [int]},
        "rsi": {"period": [int], "overbought": [float], "oversold": [float]},
        "pricediff": {"price_drop_pct": [float], "price_rise_pct": [float], "initial_entry_price": [float]}
    }
}

STRATEGIES_STRUCTURE = {
    "strategy_names": {"single", "dca", "duration"},

    "all_strategy_params": {
        "duration": {"duration": int}
    },

    "all_strategy_optimize_params": {
        "duration": {"duration": [int]}
    }
}
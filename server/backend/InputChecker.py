from alpaca_api_handler import AlpacaApiHandler
from constants import *

class InputChecker():
    def check_inputs(configs):
        trader_settings = configs["trader_settings"]
        data_settings = configs["data_settings"]
        signals = configs["signals"]
        strategies = configs["strategies"]

        if InputChecker.check_trader_settings(trader_settings):
            optimize = trader_settings["optimize"]
            return (
                InputChecker.check_data_settings(data_settings) and
                InputChecker.check_signals(signals, optimize) and
                InputChecker.check_strategies(strategies, optimize)
            )

    def check_data_settings(data_settings):
        if set(data_settings.keys()) == DATA_SETTINGS_STRUCTURE:
            return AlpacaApiHandler.check_alpaca_data_settings(data_settings)
        return False

    def check_signals(signals, optimize):
        if not optimize:
            if set(signals["signal_names"]).issubset(set(signals["all_signal_params"]).keys()):
                return InputChecker.check_signal_params(signals["all_signal_params"])
        else:
            if set(signals["signal_names"]).issubset(set(signals["all_signal_optimize_params"]).keys()):
                return InputChecker.check_signal_params(signals["all_signal_optimize_params"])
        return False

    def check_signal_params(all_signal_params):
        if not set(all_signal_params.keys()).issubset(SIGNAL_PARAMS.keys()):
            return False

        for signal_name, params in all_signal_params.items():
            input_params = set(params.keys())
            valid_params = SIGNAL_PARAMS[signal_name]
            if input_params != valid_params:
                return False

        return True

    def check_strategies(strategies, optimize):
        if set(strategies["strategy_names"]).issubset(STRATEGIES):
            required_strategies = set(strategies["strategy_names"]).intersection(STRATEGY_PARAMS.keys())
            if not optimize:
                return InputChecker.check_strategy_params(strategies["all_strategy_params"], required_strategies)
            else:
                return InputChecker.check_strategy_params(strategies["all_strategy_optimize_params"], required_strategies)
        return False

    def check_strategy_params(all_strategy_params, required_strategies):
        if not required_strategies.issubset(set(all_strategy_params.keys())):
            return False

        for strategy_name in required_strategies:
            input_params = set(all_strategy_params[strategy_name].keys())
            valid_params = STRATEGY_PARAMS[strategy_name]
            if input_params != valid_params:
                return False
        return True
        

    def check_trader_settings(trader_settings):
        if set(trader_settings.keys()) == TRADER_SETTINGS_STRUCTURE:
            return (
                isinstance(trader_settings["starting_cash"], int) and trader_settings["starting_cash"] >= 0 and
                isinstance(trader_settings["commission"], int) and trader_settings["commission"] >= 0 and
                isinstance(trader_settings["optimize"], bool) and
                isinstance(trader_settings["plot"], bool) and
                isinstance(trader_settings["size"], int) and trader_settings["size"] >= 0
            )
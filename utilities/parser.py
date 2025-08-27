import json
from constants import *
from utilities.signal_constructor import SignalConstructor
from utilities.validator import Validator
from strategies import STRATEGY_MAP


class DataSettingsParser():
    def parse_data_settings_from_file(filename):
        try:
            with open(filename, 'r') as dataFile:
                config = json.load(dataFile)
        except FileNotFoundError as e:
            print("File not found error: {}".format(e))

        return DataSettingsParser.parse_data_settings_config(config)
    
    def parse_data_settings_config(config):
        data_settings = {}

        data_settings["symbols_to_trade"] = config["SYMBOLS_TO_TRADE"]
        data_settings["timeframe"] = config["TIMEFRAME"]
        data_settings["start_time"] = config["START_TIME"]
        data_settings["end_time"] = config["END_TIME"]

        return data_settings
    

class TraderSettingsParser():
    def parse_settings_from_file(filename):
        try:
            with open(filename, "r") as inFile:
                config = json.load(inFile)
        except FileNotFoundError as e:
            print("File not found error: {}".format(e))
        
        return TraderSettingsParser.parse_settings_config(config)
    
    def parse_settings_config(config):
        settings = {}

        settings["starting_cash"] = config["STARTING_CASH"]
        settings["commission"] = config["COMMISSION"]
        settings["optimize"] = config["OPTIMIZE"]
        settings["plot"] = config["PLOT"]
        settings["size"] = config["SIZE"]

        return settings
    

class SignalParser():
    def parse_signal_file(filename):
        try:
            with open(filename, "r") as signalsFile:
                config = json.load(signalsFile)
        except FileNotFoundError as e:
            print("File not found error: {}".format(e))

        return SignalParser.parse_signal_config(config)

    def parse_signal_config(config):
        signal_names = config["SIGNAL_NAMES"]
        all_signal_params = config["ALL_SIGNAL_PARAMS"]
        all_signal_optimize_params = config["ALL_SIGNAL_OPTIMIZE_PARAMS"]

        try:
            Validator.validate_signal_params(signal_names, all_signal_params, all_signal_optimize_params)
        except ValueError as e:
            print("Validation error {}".format(e))

        signals_single = SignalConstructor.construct_signals(signal_names, all_signal_params)
        signals_optimize = SignalConstructor.construct_signals(signal_names, all_signal_optimize_params)

        return (signals_single, signals_optimize)
    

class StrategyParser():
    def parse_strategies_from_file(filename):
        try:
            with open(filename, "r") as strategiesFile:
                config = json.load(strategiesFile)
        except FileNotFoundError as e:
            print("File not found error: {}".format(e))
        
        return StrategyParser.parse_strategies_from_config(config)
    
    def parse_strategies_from_config(config):
        selected_strategies = {"selected_strategies": []}
        strategy_names = config["STRATEGY_NAME"]

        Validator.validate_strategy(strategy_names)

        for strategy_name in strategy_names:
            selected_strategies["selected_strategies"].append(STRATEGY_MAP[strategy_name])

        return selected_strategies
import json
from business_logic.constants.constants import *
from business_logic.utilities.validator import Validator
from business_logic.trading_logic.strategies import STRATEGY_MAP


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
    def parse_signal_file(filename, optimize):
        try:
            with open(filename, "r") as signalsFile:
                config = json.load(signalsFile)
        except FileNotFoundError as e:
            print("File not found error: {}".format(e))

        return SignalParser.parse_signal_config(config, optimize)

    def parse_signal_config(config, optimize):
        signal_names = config["SIGNAL_NAMES"]
        all_signal_params = config["ALL_SIGNAL_PARAMS"]
        all_signal_optimize_params = config["ALL_SIGNAL_OPTIMIZE_PARAMS"]

        try:
            Validator.validate_signal_params(signal_names, all_signal_params, all_signal_optimize_params, optimize)
        except ValueError as e:
            print("Validation error {}".format(e))

        return (signal_names, all_signal_params, all_signal_optimize_params)
    

class StrategyParser():
    def parse_strategies_from_file(filename, optimize):
        try:
            with open(filename, "r") as strategiesFile:
                config = json.load(strategiesFile)
        except FileNotFoundError as e:
            print("File not found error: {}".format(e))
        
        return StrategyParser.parse_strategies_from_config(config, optimize)
    
    def parse_strategies_from_config(config, optimize):
        strategy_names = config["STRATEGY_NAMES"]
        all_strategy_params = config["ALL_STRATEGY_PARAMS"]
        all_strategy_optimize_params = config["ALL_STRATEGY_OPTIMIZE_PARAMS"]

        try:
            Validator.validate_strategy_params(strategy_names, all_strategy_params, all_strategy_optimize_params, optimize)
        except ValueError as e:
            print("Validation error {}".format(e))

        return (strategy_names, all_strategy_params, all_strategy_optimize_params)

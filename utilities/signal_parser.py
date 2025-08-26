import json
from constants import *
from utilities.signal_constructor import SignalConstructor
from utilities.validator import Validator

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

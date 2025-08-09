import json
from signal_map import SIGNAL_MAP


def validate_params(config):
    signal_names = config["SIGNAL_NAMES"]
    all_signal_params = config["ALL_SIGNAL_PARAMS"]
    all_signal_optimize_params = config["ALL_SIGNAL_OPTIMIZE_PARAMS"]

    for signal_name in signal_names:
        signal_class = SIGNAL_MAP[signal_name]
        if not signal_class:
            raise ValueError("Signal {} not found".format(signal_name))

        given_params = set(all_signal_params[signal_name].keys())
        given_optimize_params = set(all_signal_optimize_params[signal_name].keys())
        required_params = set(signal_class.required_params)
        if not given_params.issubset(required_params):
            missing_params = required_params - given_params
            raise ValueError("Signal {} missing parameters {}".format(signal_name, missing_params))
        elif not given_optimize_params.issubset(required_params):
            missing_params = required_params - given_params
            raise ValueError("Signal {} missing parameters {} for optimization".format(signal_name, missing_params))


def construct_signals_optimize(config):
    reconstructed_signals = {}
    signal_names = config["SIGNAL_NAMES"]
    all_signal_optimize_params = config["ALL_SIGNAL_OPTIMIZE_PARAMS"]

    for signal_name in signal_names:
        for param, value in all_signal_optimize_params[signal_name].items():
            key = "{}/{}".format(signal_name, param)
            reconstructed_signals[key] = value
    
    return reconstructed_signals


def deconstruct_signals_optimize(reconstructed_signals):
    signal_names = []
    all_signal_params = {}

    for key, value in reconstructed_signals.items():
        split_key = key.split('/')
        signal_name = split_key[0]
        param = split_key[1]

        if signal_name not in signal_names:
            signal_names.append(signal_name)

        if signal_name not in all_signal_params.keys():
            all_signal_params[signal_name] = {}

        all_signal_params[signal_name][param] = value

    signals = {"signal_names": signal_names, "all_signal_params": all_signal_params}

    return signals
    

try:
    with open("json/signals.json", "r") as signalsFile:
        config = json.load(signalsFile)
except FileNotFoundError as e:
    print("File not found error: {}".format(e))

try:
    validate_params(config)
except ValueError as e:
    print("Validation error: {}".format(e))

signals = {}
signals["signal_names"] = config["SIGNAL_NAMES"]
signals["all_signal_params"] = config["ALL_SIGNAL_PARAMS"]

signals_optimize = construct_signals_optimize(config)
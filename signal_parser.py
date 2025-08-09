import json
from signal_map import SIGNAL_MAP


def validate_params(signals):
    signal_names = signals["SIGNAL_NAMES"]
    all_signal_params = signals["ALL_SIGNAL_PARAMS"]
    all_signal_optimize_params = signals["ALL_SIGNAL_OPTIMIZE_PARAMS"]

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


try:
    with open("json/signals.json", "r") as signalsFile:
        signals = json.load(signalsFile)
except FileNotFoundError as e:
    print("File not found error: {}".format(e))

try:
    validate_params(signals)
    signal_names = signals["SIGNAL_NAMES"]
    all_signal_params = signals["ALL_SIGNAL_PARAMS"]
except ValueError as e:
    print("Validation error: {}".format(e))
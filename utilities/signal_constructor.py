from constants import DIVIDER

class SignalConstructor():
    #TODO: a simple test here
    def construct_signals(signal_names, all_signal_params):
        signals = {}

        for signal_name in signal_names:
            for param, value in all_signal_params[signal_name].items():
                key = "{}{}{}".format(signal_name, DIVIDER, param)
                signals[key] = value
            
        return signals

    def deconstruct_signals(signals_optimize):
        signals = {}
        signal_names = []
        all_signal_params = {}

        for key, value in signals_optimize.items():
            split_key = key.split(DIVIDER)
            signal_name = split_key[0]
            param = split_key[1]

            if signal_name not in signal_names:
                signal_names.append(signal_name)

            if signal_name not in all_signal_params.keys():
                all_signal_params[signal_name] = {}

            all_signal_params[signal_name][param] = value

        signals["signal_names"] = signal_names
        signals["all_signal_params"] = all_signal_params

        return (signal_names, all_signal_params)
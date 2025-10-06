import backtrader as bt

class DynamicSignal(bt.Indicator):
    required_params = []
    params = ()
    lines = ("buy_signal", "sell_signal")

    plotinfo = dict(plot=False)

    def update_state_with_order(self, order):
        pass

    def update_state_with_trade(self, trade):
        pass


class SMASignal(DynamicSignal):
    required_params = ["fast", "slow"]
    params = (
        ("fast", 0),
        ("slow", 0)
    )

    def __init__(self):
        self.fast_ma = bt.indicators.SimpleMovingAverage(self.data, period=self.params.fast)
        self.slow_ma = bt.indicators.SimpleMovingAverage(self.data, period=self.params.slow)
    
    def next(self):
        self.lines.buy_signal[0] = self.fast_ma[0] > self.slow_ma[0] and self.fast_ma[-1] < self.slow_ma[-1]
        self.lines.sell_signal[0] = self.fast_ma[0] < self.slow_ma[0] and self.fast_ma[-1] > self.slow_ma[-1]


class RSISignal(DynamicSignal):
    required_params = ["period", "overbought", "oversold"]
    params = (
        ("period", 0),
        ("overbought", 0),
        ("oversold", 0)
    )

    def __init__(self):
        self.rsi = bt.indicators.RSI(self.data, period=self.params.period)

    def next(self):
        self.lines.buy_signal[0] = self.rsi[0] > self.params.overbought and self.rsi[-1] < self.params.overbought
        self.lines.sell_signal[0] = self.rsi[0] < self.params.oversold and self.rsi[-1] > self.params.oversold


SIGNAL_MAP = {
    "sma": SMASignal,
    "rsi": RSISignal,
}


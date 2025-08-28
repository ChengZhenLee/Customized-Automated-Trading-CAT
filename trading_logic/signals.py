import backtrader as bt

class DynamicSignal(bt.Indicator):
    required_params = []
    params = ()
    lines = ("buy_signal", "sell_signal")

    plotinfo = dict(subplot = False)

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


class PriceDiffSignal(DynamicSignal):
    required_params = ("price_drop_pct", "price_rise_pct", "initial_entry_price")
    params = (
        ("price_drop_pct", 0),
        ("price_rise_pct", 0),
        ("initial_entry_price", 0)
    )

    def __init__(self):
        self.dataclose = self.data.close
        self.last_entry_price = None

    def update_state(self, order):
        if order.status in [order.Completed]:
            self.last_entry_price = order.executed.price

    def next(self):
        self.lines.buy_signal[0] = False
        self.lines.sell_signal[0] = False
        current_price = self.dataclose

        if self.last_entry_price:
            price_drop_threshold = self.last_entry_price * (1 - self.params.price_drop_pct)
            price_rise_threshold = self.last_entry_price * (1 + self.params.price_rise_pct)
            if current_price <= price_drop_threshold:
                self.lines.buy_signal[0] = True
            elif current_price >= price_rise_threshold:
                self.lines.sell_signal[0] = True
        
        else:
            if current_price <= self.params.initial_entry_price:
                self.lines.buy_signal[0] = True
            elif current_price >= self.params.initial_entry_price:
                self.lines.sell_signal[0] = True


SIGNAL_MAP = {
    "sma": SMASignal,
    "rsi": RSISignal,
    "pricediff": PriceDiffSignal,
}


import backtrader as bt

class DynamicSignal(bt.Indicator):
    required_params = []
    lines = ("buy_signal", "sell_signal")
    params = ()

    def notify_order(self, order):
        pass

    def notify_trade(self, trade):
        pass


class SMACrossoverSignal(DynamicSignal):
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



#TODO: Fix this Signal
# class PriceDiffSignal(DynamicSignal):
#     required_params = ["price_drop_pct", "price_rise_pct", "initial_entry_price"]
#     params = (
#         ("price_drop_pct", 0),
#         ("price_rise_pct", 0),
#         ("initial_entry_price", 0)
#     )

#     def __init__(self):
#         self.last_entry_price = None
#         self.initial_entry = True

#     def notify_order(self, order):
#         if order.status in [order.Completed] and order.isbuy():
#             self.last_entry_price = order.executed.price

#     def next(self):
#         self.lines.buy_signal[0] = False
#         self.lines.sell_signal[0] = False
#         current_price = self.data.close[0]

#         if self.initial_entry:
#             if current_price <= self.params.initial_entry_price:
#                 self.lines.buy_signal[0] = True
#                 self.initial_entry = False
#             elif current_price >= self.params.initial_entry_price:
#                 self.lines.sell_signal[0] = True
#                 self.initial_entry = False
        
#         elif self.last_entry_price:
#             if current_price <= self.last_entry_price:
#                 self.lines.buy_signal[0] = True
#             elif current_price >= self.last_entry_price:
#                 self.lines.sell_signal[0] = True

SIGNAL_MAP = {
    "sma": SMACrossoverSignal,
    "rsi": RSISignal,
    # "pricediff": PriceDiffSignal
}
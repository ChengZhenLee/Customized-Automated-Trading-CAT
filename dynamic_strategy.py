import backtrader as bt
from signal_map import SIGNAL_MAP

class DynamicStrategy(bt.Strategy):
    def log(self, txt, dt=None, printdt=True):
        if printdt:
            dt = dt or self.data.datetime.date(0)
            print("{}: {}".format(dt.isoformat(), txt))
        else:
            print(txt)

    def __init__(self, signal_names, all_signal_params):
        self.order = None
        self.dataclose = self.data.close
        self.signals = []

        for signal_name in signal_names:
            signal_class = SIGNAL_MAP[signal_name]
            signal_params = all_signal_params[signal_name]

            self.signals.append(signal_class(self.data, **signal_params))
        
    def notify_order(self, order):
        if order.status in [order.Submitted, order.Accepted]:
            return

        if order.status in [order.Completed]:
            if order.isbuy():
                self.log("BUY EXECUTED: {:.2f}".format(order.executed.price))
            elif order.issell():
                self.log("SELL EXECUTED: {:.2f}".format(order.executed.price))
            
        if order.status in [order.Canceled, order.Margin, order.Rejected]:
            self.log("Order Canceled/Margin/Rejected")

        self.order = None

    def notify_trade(self, trade):
        if not trade.isclosed:
            return
        
        self.log("OPERATION PROFIT: GROSS {:.2f}, NET {:.2f}".format(trade.pnl, trade.pnlcomm))

    def next(self):
        buy_signals = [signal.lines.buy_signal[0] for signal in self.signals]
        all_buy_conditions_met = all(buy_signals)

        sell_signals = [signal.lines.sell_signal[0] for signal in self.signals]
        all_sell_conditions_met = all(sell_signals)

        if not self.position and all_buy_conditions_met:
            self.order = self.buy()
            self.log("BUY CREATE: {:.2f}".format(self.dataclose[0]))
        elif all_sell_conditions_met:
            self.order = self.sell()
            self.log("SELL CREATE: {:.2f}".format(self.dataclose[0]))

    def stop(self):
        for signal in self.signals:
            self.log("=" * 30, printdt=False)
            signal_name = [key for key, val in SIGNAL_MAP.items() if isinstance(signal, val)][0]
            self.log("{}".format(signal_name), printdt=False)
            for param in signal.required_params:
                self.log("{}: {:.2f}".format(param, getattr(signal.params, param)), printdt=False)
            self.log("=" * 30, printdt=False)
        self.log("Final Value: {:.2f}".format(self.broker.getvalue()), printdt=False)
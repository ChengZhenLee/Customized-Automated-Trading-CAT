import backtrader as bt
from signals import SIGNAL_MAP
from utilities.signal_constructor import SignalConstructor
from utilities.log_and_message import Logger, MessageCreater


class CombinedStrategy(bt.Strategy):
    def __init__(self, **kwargs):
        self.signals = []
        self.strategies = []

        selected_strategies = kwargs.pop("selected_strategies")
        (signal_names, all_signal_params) = SignalConstructor.deconstruct_signals(kwargs)

        for signal_name in signal_names:
            signal_class = SIGNAL_MAP[signal_name]
            signal_params = all_signal_params[signal_name]
            self.signals.append(signal_class(self.data, **signal_params))

        for selected_strategy in selected_strategies:
            self.strategies.append(selected_strategy(self))

    def notify_order(self, order):
        for strategy in self.strategies:
            strategy.notify_order(order)
    
    def notify_trade(self, trade):
        for strategy in self.strategies:
            strategy.notify_trade(trade)

    def next(self):
        for strategy in self.strategies:
            strategy.next()

    def stop(self):
        final_result_message = MessageCreater.create_final_result_message(self.signals, self.broker.getvalue())
        Logger.log(final_result_message)
        
        
class GenericStrategy():
    plotinfo = dict(subplot=True)

    def __init__(self, parent):
        self.order = None
        self.parent = parent
        self.date = self.parent.data.datetime.date
        self.dataclose = self.parent.data.close
        self.signals = self.parent.signals

    
    def notify_order(self, order):
        for signal in self.signals:
            signal.update_state_with_order(order)

        if order.status in [order.Submitted, order.Accepted]:
            return

        if order.status in [order.Completed]:
            if order.isbuy():
                order_executed_message = MessageCreater.create_order_executed_message(order.executed.price, "buy")
            elif order.issell():
                order_executed_message = MessageCreater.create_order_executed_message(order.executed.price, "sell")
        else:
            order_executed_message = MessageCreater.create_order_executed_message(mode="Canceled/Margin/Rejected")
        
        Logger.log(order_executed_message, self.date(0))
        self.order = None

    def notify_trade(self, trade):
        for signal in self.signals:
            signal.update_state_with_trade(trade)
        
        if not trade.isclosed:
            return
        
        trade_result_message = MessageCreater.create_trade_result_message(trade.pnl, trade.pnlcomm)
        Logger.log(trade_result_message, self.date(0))


class SinglePositionStrategy(GenericStrategy):
    def next(self):
        order_creation_message = None
        buy_signals = [signal.lines.buy_signal[0] for signal in self.signals]
        all_buy_conditions_met = all(buy_signals)

        sell_signals = [signal.lines.sell_signal[0] for signal in self.signals]
        all_sell_conditions_met = all(sell_signals)

        if not self.parent.position and all_buy_conditions_met:
            self.parent.order = self.parent.buy()
            order_creation_message = MessageCreater.create_order_creation_message(self.dataclose[0], "buy")
        elif self.parent.position and all_sell_conditions_met:
            self.parent.order = self.parent.sell()
            order_creation_message = MessageCreater.create_order_creation_message(self.dataclose[0], "sell")
        
        if order_creation_message:
            Logger.log(order_creation_message, self.date(0))


class DCAStrategy(GenericStrategy):
    def next(self):
        order_creation_message = None
        buy_signals = [signal.lines.buy_signal[0] for signal in self.signals]
        all_buy_conditions_met = all(buy_signals)

        sell_signals = [signal.lines.sell_signal[0] for signal in self.signals]
        all_sell_conditions_met = all(sell_signals)

        if all_buy_conditions_met:
            self.order = self.parent.buy()
            order_creation_message = MessageCreater.create_order_creation_message(self.dataclose[0], "buy")
        elif all_sell_conditions_met:
            self.order = self.parent.close()
            order_creation_message = MessageCreater.create_order_creation_message(self.dataclose[0], "sell")

        if order_creation_message:
            Logger.log(order_creation_message, self.date(0))


# TODO: Implement a component based hierarchy instead of a rigid hierarchy


STRATEGY_MAP = {
    "single": SinglePositionStrategy,
    "dca": DCAStrategy
}
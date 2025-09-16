import backtrader as bt
from business_logic.trading_logic.signals import SIGNAL_MAP
from business_logic.utilities.parameter_manager import BacktesterParameterManager, StrategyParameterManager, SignalParameterManager
from business_logic.utilities.log_and_message import MessageCreater


class CombinedStrategy(bt.Strategy):
    def __init__(self, **kwargs):
        self.signals = []
        self.strategies = []
        self.logger = kwargs.pop("logger")

        (strategies, signals) = BacktesterParameterManager.deserialize_backtester_parameters(kwargs)
        (selected_strategies, all_strategy_params) = StrategyParameterManager.deserialize_strategies(strategies)
        (signal_names, all_signal_params) = SignalParameterManager.deserialize_signals(signals)

        for signal_name in signal_names:
            signal_class = SIGNAL_MAP[signal_name]
            signal_params = all_signal_params.get(signal_name, {})
            self.signals.append(signal_class(self.data, **signal_params))

        for strategy_name in selected_strategies:
            strategy_class = STRATEGY_MAP[strategy_name]
            strategy_params = all_strategy_params.get(strategy_name, {})
            self.strategies.append(strategy_class(self, **strategy_params))

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
        final_value = self.broker.getvalue()
        final_message = MessageCreater.create_final_result_message(self.strategies, self.signals, final_value)
        self.logger.log(final_message)
        
        
class GenericStrategy():
    plotinfo = dict(subplot=True)

    required_params = []

    def __init__(self, parent, **kwargs):
        self.order = None
        self.parent = parent
        self.date = self.parent.data.datetime.date
        self.dataclose = self.parent.data.close
        self.signals = self.parent.signals
        self.logger = self.parent.logger

    
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
        
        self.logger.log(order_executed_message, self.date(0))
        self.order = None

    def notify_trade(self, trade):
        for signal in self.signals:
            signal.update_state_with_trade(trade)
        
        if not trade.isclosed:
            return
        
        trade_result_message = MessageCreater.create_trade_result_message(trade.pnl, trade.pnlcomm)
        self.logger.log(trade_result_message, self.date(0))


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
            self.logger.log(order_creation_message, self.date(0))


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
            self.logger.log(order_creation_message, self.date(0))


class DurationStrategy(GenericStrategy):
    required_params = ["duration"]

    def __init__(self, parent, **kwargs):
        super().__init__(parent, **kwargs)
        self.duration = kwargs.get("duration")
        self.bar_counter = 0

    def next(self):
        order_creation_message = None
        buy_signals = [signal.lines.buy_signal[0] for signal in self.signals]
        all_buy_conditions_met = all(buy_signals)

        sell_signals = [signal.lines.sell_signal[0] for signal in self.signals]
        all_sell_conditions_met = all(sell_signals)

        # Not in a position yet
        if not self.parent.position:
            self.bar_counter = 0
            if all_buy_conditions_met:
                self.parent.order = self.parent.buy()
                order_creation_message = MessageCreater.create_order_creation_message(self.dataclose[0], "buy")
            elif all_sell_conditions_met:
                self.parent.order = self.parent.sell()
                order_creation_message = MessageCreater.create_order_creation_message(self.dataclose[0], "sell")

        # Already in a position
        elif self.parent.position:
            self.bar_counter += 1
            if all_buy_conditions_met or self.bar_counter >= self.duration:
                if self.parent.position.size > 0:
                    self.parent.order = self.parent.sell()
                    order_creation_message = MessageCreater.create_order_creation_message(self.dataclose[0], "sell")
                elif self.parent.position.size < 0:
                    self.parent.order = self.parent.buy()
                    order_creation_message = MessageCreater.create_order_creation_message(self.dataclose[0], "buy")

        if order_creation_message:
            self.logger.log(order_creation_message, self.date(0))


STRATEGY_MAP = {
    "single": SinglePositionStrategy,
    "dca": DCAStrategy,
    "duration": DurationStrategy
}
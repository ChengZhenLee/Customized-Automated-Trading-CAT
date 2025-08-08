import backtrader as bt

class DynamicStrategy(bt.Strategy):
    order = None
    required_params = []
    params = ()

    def log(self, txt, dt=None, doprint=False):
        dt = dt or self.datas[0].datetime.date(0)
        message = "{}, {}".format(dt.isoformat(), txt)
        if doprint:
            print(message)
        
    def notify_order(self, order):
        if order.status in [order.Submitted, order.Accepted]:
            return
        
        if order.status in [order.Completed]:
            if order.isbuy():
                self.log("BUY EXECUTED {:.2f}".format(self.dataclose[0]))
            elif order.issell():
                self.log("SELL EXECUTED {:.2f}".format(self.dataclose[0]))

        elif order.status in [order.Canceled, order.Margin, order.Rejected]:
            self.log("Order Canceled/Margin/Rejected")

        self.order = None

    def notify_trade(self, trade):
        if not trade.isclosed:
            return
        
        self.log("OPERATION PROFIT: GROSS {:.2f}, NET {:.2f}".format(trade.pnl, trade.pnlcomm))

    def stop(self):
        txt = ""
        for param in self.required_params:
            txt += "{}: {}, ".format(param, getattr(self.params, param))
        self.log(txt + "Final Result: {}".format(self.broker.getvalue()), doprint=True)


class SMAStrategy(DynamicStrategy):
    required_params = ["fastmaperiod", "slowmaperiod"]
    params = (
        ("fastmaperiod", 0),
        ("slowmaperiod", 0),
    )
    
    def __init__(self):
        self.dataclose = self.datas[0].close
        self.fastsma = bt.indicators.SimpleMovingAverage(self.datas[0], period=self.params.fastmaperiod)
        self.slowsma = bt.indicators.SimpleMovingAverage(self.datas[0], period=self.params.slowmaperiod)

    def next(self):
        if self.order:
            return
        
        if not self.position:
            if self.fastsma[0] > self.slowsma[0]:
                self.order = self.buy()
        
        elif self.fastsma[0] < self.slowsma[0]:
            self.order = self.sell()


class RSIStrategy(DynamicStrategy):
    required_params = ["rsiperiod", "overbought", "oversold"]
    params = (
        ("rsiperiod", 0),
        ("overbought", 0),
        ("oversold", 0),
    )

    def __init__(self):
        self.dataclose = self.datas[0].close
        self.rsi = bt.indicators.RelativeStrengthIndex(self.datas[0], period=self.params.rsiperiod)
    
    def next(self):
        if self.order:
            return
        
        if not self.position:
            if self.rsi < self.params.oversold:
                self.order = self.buy()

        elif self.rsi > self.params.overbought:
            self.order = self.sell()
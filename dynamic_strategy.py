import backtrader as bt

class DynamicStrategy(bt.Strategy):
    order = None

    def log(self, txt, dt=None, doprint=False):
        if doprint:
            dt = dt or self.datas[0].datetime.date(0)
            print("{}, {}".format(dt.isoformat(), txt))
        
    def notify_order(self, order):
        if order.status in [order.Submitted, order.Accepted]:
            return
        
        if order.status in [order.Completed]:
            if order.isbuy():
                self.log("BUY EXECUTED {:.2f}".format(self.dataclose[0]), doprint=True)
            elif order.issell():
                self.log("SELL EXECUTED {:.2f}".format(self.dataclose[0]), doprint=True)

        elif order.status in [order.Canceled, order.Margin, order.Rejected]:
            self.log("Order Canceled/Margin/Rejected")

        self.order = None

    def notify_trade(self, trade):
        if not trade.isclosed():
            return
        
        self.log("OPERATION PROFIT: GROSS {:.2f}, NET {:.2f}".format(trade.pnl, trade.pnlcomm))

    def error(self):
        pass


class SMAStrategy(DynamicStrategy):
    def __init__(self, params):
        self.params = params
        self.dataclose = self.datas[0].close
        self.fastsma = bt.indicators.SimpleMovingAverage(self.datas[0], period=self.params["fastmaperiod"])
        self.slowsma = bt.indicators.SimpleMovingAverage(self.datas[0], period=self.params["slowmaperiod"])

    def next(self):
        if self.order:
            return
        
        if not self.position:
            if self.fastsma[0] > self.slowsma[0]:
                self.order = self.buy()
        
        elif self.fastsma[0] < self.slowsma[0]:
            self.order = self.sell()
        
    def stop(self):
        if self.position:
            self.close()
        self.log("Fast MA: {:.2f}, Slow MA: {:.2f}, End Value: {:.2f}".format(
            self.params["fastmaperiod"], self.params["slowmaperiod"], self.broker.getvalue()))

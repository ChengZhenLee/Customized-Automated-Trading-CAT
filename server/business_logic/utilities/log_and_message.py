import os
from business_logic.utilities.dirs_and_files import DirsFiles


class LoggerLoader():
    def setup_logger(fullpath):
        return Logger(fullpath)
    
    
class Logger():
    def __init__(self, fileName):
        self.fileName = fileName
    
    def log(self, txt, dt=None):
        if dt:
            message = "{}: {}\n".format(dt.isoformat(), txt)
        else:
            message = txt

        if self.fileName:
            with open(self.fileName, 'a', encoding='UTF-8') as outFile:
                outFile.write(message)
                
            outFile.close()
        else:
            print(message)


class MessageCreater():
    def create_order_creation_message(price, mode):
        if mode == "buy":
            message = "📈 BUY CREATE: "
        elif mode == "sell":
            message = "📉 SELL CREATE: "
        message += "{:.2f}".format(price)
        
        return message
    
    def create_order_executed_message(price=None, mode=""):
        if mode == "buy":
            message = "🟢 BUY EXECUTED: "
        elif mode == "sell":
            message = "🔴 SELL EXECUTED: "
        else:
            return "❌Order Canceled/Margin/Rejected"
        
        message += "{:.2f}".format(price)
        return message
    
    def create_trade_result_message(pnl, pnlcomm):
        message = "💲 OPERATION PROFIT: "
        message += "GROSS {:.2f}, ".format(pnl)
        message += "NET {:.2f}".format(pnlcomm)

        return message
    
    def create_strategies_result_message(strategies):
        message = ""
        for strategy in strategies:
            message += "=" * 30 + "\n"
            strategy_name = strategy.__class__.__name__
            message += "Strategy: {}\n".format(strategy_name)
            for param in strategy.required_params:
                message += "{}: {:.2f}\n".format(param, getattr(strategy, param))
            message += "=" * 30 + "\n"
        
        return message

    def create_signals_result_message(signals):
        message = ""
        for signal in signals:
            message += "=" * 30 + "\n"
            signal_name = signal.__class__.__name__
            message += "Signal: {}\n".format(signal_name)
            for param in signal.required_params:
                message += "{}: {:.2f}\n".format(param, getattr(signal.params, param))
            message += "=" * 30 + "\n"
        return message
    
    def create_final_result_message(strategies, signals, final_value):
        message = ""
        message += MessageCreater.create_strategies_result_message(strategies)
        message += MessageCreater.create_signals_result_message(signals)
        message += "🏁 Final Portfolio Value: {:.2f}".format(final_value)
        return message
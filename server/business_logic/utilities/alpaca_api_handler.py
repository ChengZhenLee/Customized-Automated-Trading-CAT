from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
from datetime import datetime
import json

class AlpacaAPIHandler():
    def parse_alpaca_keys_from_file(filename):
        alpaca_keys = {}

        try:
            with open(filename, 'r') as keysFile:
                config = json.load(keysFile)
        except FileNotFoundError as e:
            print("File not found error: {}".format(e))

        alpaca_keys["alpaca_api_key"] = config["ALPACA_API_KEY"]
        alpaca_keys["alpaca_secret_key"] = config["ALPACA_SECRET_KEY"]

        return alpaca_keys
    
    def fetch_alpaca_stock_bars_data(alpaca_keys, data_settings):
        client = StockHistoricalDataClient(alpaca_keys["alpaca_api_key"],
                                           alpaca_keys["alpaca_secret_key"])
        
        request_params = StockBarsRequest(
            symbol_or_symbols=data_settings["symbols_to_trade"],
            timeframe=getattr(TimeFrame, data_settings["timeframe"]),
            start=datetime(data_settings["start_time"]["year"], 
                           data_settings["start_time"]["month"], 
                           data_settings["start_time"]["day"]),
            end=datetime(data_settings["end_time"]["year"], 
                         data_settings["end_time"]["month"], 
                         data_settings["end_time"]["day"])
        )

        return client.get_stock_bars(request_params)
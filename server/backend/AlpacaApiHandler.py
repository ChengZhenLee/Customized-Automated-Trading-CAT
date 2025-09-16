from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
from alpaca.common.exceptions import APIError
from backend.constants import ALPACA_API_KEYS
from backend.ErrorMessages import ErrorMessages as em
from datetime import datetime
import json

class AlpacaApiHandler():
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

    def check_alpaca_data_settings(data_settings):
        alpaca_keys = AlpacaApiHandler.parse_alpaca_keys_from_file(ALPACA_API_KEYS)
        client = StockHistoricalDataClient(alpaca_keys["alpaca_api_key"],
                                        alpaca_keys["alpaca_secret_key"])
        
        try:
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

            bars = client.get_stock_bars(request_params)

            if len(bars.data) > 0:
                return True, None
            return False, em.invalid_value("symbols_to_trade", "The stock symbol is invalid")
        except APIError as e:
            return False, em.invalid_value("API Error: Alpaca API error: {e}")
        except Exception as e:
            return False, em.generic_error("Unexpected Error: An unexpected error occured")
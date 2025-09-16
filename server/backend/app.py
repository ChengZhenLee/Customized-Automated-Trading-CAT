from flask import Flask
from backend.LogicInputHandler import LogicInputHandler
from business_logic.core.main_logic import MainLogic

app = Flask(__name__)

#@app.route('/backtrader', method = ["POST"])
def run_backtester():
    configs = request.get_json()
    error_message = check_inputs(configs)
    
    if error_message:
        # TODO
        pass
    
    LogicInputHandler.input_to_logic(config)
    MainLogic.run()

if __name__ == "__main__":
    #app.run(debug=True)
    MainLogic.run()
    
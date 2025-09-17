import uuid
from flask import Flask
from backend.InputChecker import InputChecker
from backend.LogicInputHandler import LogicInputHandler
from backend.DirsFiles import DirsFiles
from business_logic.core.main_logic import MainLogic
from business_logic.cleanup.cleaner import Cleaner

app = Flask(__name__)

"""
@app.route('/backtrader', method=["POST"])
def run_backtester():
    configs = request.get_json()
    error_message = InputChecker.check_inputs(configs)
    
    if error_message:
        return jsonify({"error": error_message}), 400
    
    # TODO: put this logic into a backgroundworker (celery and redis)
    # TODO: change the business_logic to include dynamically created folders instead of constant file paths
    # TODO: change the cleanup to cleanup the dynamically created folders
    task_id = str(uuid.uuid4())
    task_dir = LogicInputHandler.input_to_logic(task_id, config)
    MainLogic.run(task_dir)
    
@app.route('/backtrader', method=["GET"])
def return_backtester_results():
    # frontend user should regularly poll to get the results
    pass
"""

import json
if __name__ == "__main__":
    #app.run(debug=True)
    
    # test the workflow
    with open("example_configs.json", 'r') as file:
        configs = json.load(file)
        
    error_message = InputChecker.check_inputs(configs)
    if error_message:
        print(error_message)
        exit()
    
    task_id = str(uuid.uuid4())
    task_dir = DirsFiles.create_task_dir(task_id)
    paths = DirsFiles.build_paths(task_dir)
    LogicInputHandler.input_to_logic(paths, configs)
    MainLogic.run(task_dir)
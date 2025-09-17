import uuid
from flask import Flask, request, jsonify
from backend.InputChecker import InputChecker
from backend.tasks import run_backtest_task
from backend.tasks import app as task_app

app = Flask(__name__)


@app.route('/backtrader', methods=["POST"])
def run_backtester():
    configs = request.get_json()
    error_message = InputChecker.check_inputs(configs)
    
    if error_message:
        return jsonify({"error": error_message}), 400
    
    task_id = str(uuid.uuid4())
    run_backtest_task.delay(task_id, configs)
    
    return ({
        "message": "Backtest started",
        "task_id": task_id,
        "status_url": f"/backtrader/results/{task_id}",
    }), 202
    
    
@app.route('/backtrader/results/<task_id>', methods=["GET"])
def get_backtester_results(task_id):
    task_result = task_app.AsyncResult(task_id)
    
    if task_result.successful():
        return_value = task_result.get()
        
        paths = return_value.get("paths")
    
    elif task_result.failed():
        metadata = task_result.info
        error_message = metadata.get("error")
        return jsonify({"status": "failed", "error": error_message}), 500
    
    else:
        return jsonify({"status": "pending", "message": "Backtest is still in progress"}), 200
        

# import json
# from business_logic.core.main_logic import MainLogic
# from backend.LogicInputHandler import LogicInputHandler
# from backend.DirsFiles import DirsFiles
# if __name__ == "__main__":
#     #app.run(debug=True)
    
#     with open("example_configs.json", 'r') as file:
#         configs = json.load(file)
    
#     task_id = "test"
#     task_dir = DirsFiles.create_task_dir(task_id)
#     paths = DirsFiles.build_paths(task_dir)
#     LogicInputHandler.input_to_logic(paths, configs)
#     MainLogic.run(task_dir)
#     print(MainLogic.run(task_dir))
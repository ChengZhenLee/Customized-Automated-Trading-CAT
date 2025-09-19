import base64
import uuid
from flask import Flask, request, jsonify
from backend.celery_app import run_backtest_task, celery_app
from backend.InputChecker import InputChecker
from business_logic.cleanup.cleaner import Cleaner

flask_app = Flask(__name__)

@flask_app.route('/backtrader', methods=["POST"])
def run_backtester():
    configs = request.get_json()
    error_message = InputChecker.check_inputs(configs)
    
    if error_message:
        return jsonify({"error": error_message}), 400
    
    task_id = str(uuid.uuid4())
    print(run_backtest_task.apply_async(args=[task_id, configs], task_id=task_id))
    
    return ({
        "message": "Backtest started",
        "task_id": task_id,
        "status_url": f"/backtrader/results/{task_id}",
    }), 202
    
    
@flask_app.route('/backtrader/results/<task_id>', methods=["GET"])
def get_backtester_results(task_id):
    task_result = celery_app.AsyncResult(task_id)
    
    # If the task completed
    if task_result.successful():
        return_value = task_result.get()
        
        task_dir = return_value.get("task_dir")
        log_file = return_value.get("log_file")
        plot_file = return_value.get("plot_file")
        
        try:
            with open(log_file, 'r', encoding='utf-8') as f:
                log_data = f.read()
            f.close()
        # If the log file doesnt exist, business_logic might have failed or the result was already retrieved and cleaned up
        except Exception as e:
            return jsonify({"status": "failed", "error": str(e) + " or result for task already retrieved"}), 500
            
        try:
            with open(plot_file, 'rb') as f:
                plot_data = base64.b64encode(f.read()).decode('utf-8')
            f.close()
        except:
            plot_data = None
            
        Cleaner.clean_up(task_dir)
        
        return jsonify({"status": "completed", "log_data": log_data, "plot_data": plot_data }), 200
    
    # the task failed
    elif task_result.failed():
        metadata = task_result.info
        error_message = metadata.get("error")
        return jsonify({"status": "failed", "error": error_message}), 500
    
    # the task is still pending
    else:
        return jsonify({"status": "pending", 
                        "message": f"Task {task_id} is still pending or doesn not exist"}), 200  
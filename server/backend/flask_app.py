import base64
import uuid
from flask import Flask, request, jsonify
from backend.celery_app import run_backtest_task, celery_app
from backend.utilities.InputChecker import InputChecker
from backend.constants.constants import RUNS_DIR
from business_logic.cleanup.cleaner import Cleaner
import os

flask_app = Flask(__name__)

@flask_app.route('/backtrader', methods=["POST"])
def run_backtester():
    configs = request.get_json()
    error_message = InputChecker.check_inputs(configs)
    
    if error_message:
        return jsonify({"error": error_message}), 400
    
    task_id = str(uuid.uuid4())
    
    try:
        print(run_backtest_task.apply_async(args=[task_id, configs], task_id=task_id))
        
        return ({
            "status": "task submitted",
            "message": "Backtest started",
            "task_id": task_id,
            "status_url": f"/backtrader/results/{task_id}",
        }), 202
        
    except OperationalError as e:
        print(f"Broker connection failed: {e}")
        
        return ({
            "status": "error",
            "error": f"Failed to connect to message broker (Redis). Task submission aborted: {e}"
        }), 503
    except Exception as e:
        print(f"Unexpected error during task submission: {e}")
        
        return ({
            "status": "error",
            "error": f"An unexpected error occurred during task submission: {e}"
        }), 500
        
    
    
@flask_app.route('/backtrader/results/<task_id>', methods=["GET"])
def get_backtester_results(task_id):
    task_result = celery_app.AsyncResult(task_id)
    
    return_value = task_result.get(propagate=False)
    
    task_dir = os.path.join(RUNS_DIR, task_id)
    
    # Check if the task directory still exists
    if not os.path.exists(task_dir):
        return jsonify({"status": "retrieved", "message": f"Result for task {task_id} already retrieved and cleaned up."}), 200
    
    # If the task completed
    if task_result.successful():
        log_file = return_value.get("log_file")
        plot_file = return_value.get("plot_file")
        
        try:
            with open(log_file, 'r', encoding='utf-8') as f:
                log_data = f.read()
        # If the log file doesnt exist, results were already retrieved and cleaned up
        except Exception as e:
            return jsonify({"status": "retrieved", "message": f"Result for task {task_id} already retrieved and cleaned up."}), 200
            
        # The plot file might not exist depending on the user's input
        try:
            with open(plot_file, 'rb') as f:
                plot_data = base64.b64encode(f.read()).decode('utf-8')
        except:
            plot_data = None
            
        Cleaner.clean_up(task_dir)
        
        return jsonify({"status": "completed", "message": "Results sent successfully", "log_data": log_data, "plot_data": plot_data }), 200
    
    # the task failed, the return_value from the celery task is an Exception object
    elif task_result.failed():
        Cleaner.clean_up(task_dir)
        
        return jsonify({"status": "failed", "error": str(return_value)}), 500
    
    # the task is still pending
    else:        
        return jsonify({"status": "pending", 
                        "message": f"Task {task_id} is still pending or doesn not exist"}), 200  
import base64
import uuid
from flask import Flask, request, jsonify
from backend.tasks import run_backtest_task, celery_app
from backend.InputChecker import InputChecker
from business_logic.cleanup.cleaner import Cleaner

app = Flask(__name__)

@app.route('/backtrader', methods=["POST"])
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
    
    
@app.route('/backtrader/results/<task_id>', methods=["GET"])
def get_backtester_results(task_id):
    task_result = celery_app.AsyncResult(task_id)
    
    if task_result.successful():
        return_value = task_result.get()
        
        abs_task_dir = return_value.get("abs_task_dir")
        abs_log_file = return_value.get("abs_log_file")
        abs_plot_file = return_value.get("abs_plot_file")
        
        try:
            with open(abs_log_file, 'r', encoding='utf-8') as f:
                log_data = f.read()
            f.close()
        except:
            log_data = None
            
        try:
            with open(abs_plot_file, 'rb') as f:
                plot_data = base64.b64encode(f.read()).decode('utf-8')
            f.close()
        except:
            plot_data = None
            
        Cleaner.clean_up(abs_task_dir)
        
        return jsonify({"status": "completed", "log_data": log_data, "plot_data": plot_data }), 200
    
    elif task_result.failed():
        metadata = task_result.info
        error_message = metadata.get("error")
        return jsonify({"status": "failed", "error": error_message}), 500
    
    else:
        return jsonify({"status": "pending", "message": "Backtest is still in progress"}), 200        
    
if __name__ == "__main__":
    app.run(debug=True)
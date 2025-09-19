# First set the python path to the project root ('server')
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..'))
sys.path.insert(0, project_root)


# Celery app and tasks
from celery import Celery
from backend.constants import REDIS_URL
from backend.DirsFiles import DirsFiles
from backend.LogicInputHandler import LogicInputHandler
from business_logic.core.main_logic import MainLogic

# set up the Celery app
celery_app = Celery("backtester", broker=REDIS_URL+"/0", backend=REDIS_URL+"/1")

celery_app.conf.update(
    broker_connection_retry_on_startup=True
)

@celery_app.task(bind=True)
def run_backtest_task(self, task_id, configs):
    try:
        task_dir = DirsFiles.create_task_dir(task_id)
        paths = DirsFiles.build_paths(task_dir)
        LogicInputHandler.input_to_logic(paths, configs)
        paths = MainLogic.run(task_dir)
        
        log_file = paths.get("log")
        plot_file = paths.get("plot")
        
        # Form the absolute path so Flask app can find the files
        abs_task_dir = DirsFiles.create_abs_path(project_root, task_dir)
        abs_log_file = DirsFiles.create_abs_path(project_root, log_file)
        abs_plot_file = DirsFiles.create_abs_path(project_root, plot_file)
        
        result = {"status": "Completed", 
                "task_id": task_id, 
                "abs_task_dir": abs_task_dir, 
                "abs_log_file": abs_log_file, 
                "abs_plot_file": abs_plot_file}
        return result
    except Exception as e:
        self.update_state(state="FAILURE", meta={"error": str(e)})
        return {"status": "Failed", "task_id": task_id, "error": str(e)}

if __name__ == "__main__":
    celery_app.start()
# Celery app and tasks
from celery import Celery
from backend.constants.constants import REDIS_URL
from backend.utilities.DirsFiles import DirsFiles
from backend.utilities.LogicInputHandler import LogicInputHandler
from business_logic.core.main_logic import MainLogic

# set up the Celery app
celery_app = Celery("backtester", broker=REDIS_URL+"/0", backend=REDIS_URL+"/1")

celery_app.conf.update(
    broker_connection_retry_on_startup=True,
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
        
        result = {
            "status": "Completed", 
            "task_id": task_id, 
            "task_dir": task_dir,
            "log_file": log_file,
            "plot_file": plot_file
        }
        return result
    except Exception as e:
        raise e

if __name__ == "__main__":
    celery_app.start()
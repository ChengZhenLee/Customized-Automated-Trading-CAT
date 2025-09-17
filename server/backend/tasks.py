from celery import Celery
import os
import uuid
from backend.constants import REDIS_URL
from backend.DirsFiles import DirsFiles
from business_logic.core.main_logic import MainLogic

redis_url = os.environ.get("REDIS_URL", REDIS_URL)
app = Celery("backtester", broker=redis_url, backend=redis_url)

@app.task(bind=True)
def run_backtest_task(self, task_id, configs):
    try:
        task_dir = DirsFiles.create_task_dir(task_id)
        paths = DirsFiles.build_paths(task_dir)
        LogicInputHandler.input_to_logic(paths, configs)
        result_paths = MainLogic.run(task_dir)
    
        return({"status": "Completed", "task_id": task_id, "result_paths": result_paths})
    except Exception as e:
        self.update_state(state="FAILURE", meta={"error": str(e)})
        return ({"status": "Failed", "task_id": task_id, "error": str(e)})
import shutil
import os

class Cleaner():
    def clean_up(task_dir):
        if os.path.exists(task_dir):
            try:
                shutil.rmtree(task_dir)
                print(f"Successfully cleaned up directory for task: {task_dir}")
            except OSError as e:
                print(f"Error: Directory clean up failed for {task_dir} - {e}")
                
if __name__ == "__main__":
    Cleaner.clean_up("backtest_runs/test")

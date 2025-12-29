import shutil
import os

class Cleaner():
    def clean_up(task_dir):
        target_path = os.path.abspath(task_dir)

        if not os.path.exists(target_path):
            print(f"Directory {target_path} does not exist.")
            return
        
        test_path = os.path.abspath(os.path.join(os.getcwd(), "backtest_runs", "test"))
        print(test_path)
        print(target_path)
        # Do not delete the configuration files in the test directory
        if task_dir == test_path:
            files_to_remove = ["plot.png", "data.csv", "results.txt"]

            for file in files_to_remove:
                file_path = os.path.join(target_path, file)
                try:
                    if os.path.exists(file_path):
                        os.remove(file_path)
                        print(f"Successfully removed {file}")
                except OSError as e:
                    print(f"Error: Could not remove {file} - {e}")
            print(f"Successfully cleaned up directory for test directory (configs preserved)")

        else:
            try:
                shutil.rmtree(target_path)
                print(f"Successfully cleaned up directory for task: {target_path}")
            except OSError as e:
                print(f"Error: Directory clean up failed for {target_path} - {e}")
                
if __name__ == "__main__":
    Cleaner.clean_up("backtest_runs/test")

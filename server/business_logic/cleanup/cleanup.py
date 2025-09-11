import os
from config.constants import DATA_CSV, LOG_FILE, PLOT_FILE

class Cleaner():
    def clean_up():
        if os.path.exists(DATA_CSV):
            os.remove(DATA_CSV)

        folder = (LOG_FILE.split('/'))[0]
        for file in os.listdir(folder):
            file_path = os.path.join(folder, file)
            os.remove(file_path)

        folder = (PLOT_FILE.split('/'))[0]
        for file in os.listdir(folder):
            file_path = os.path.join(folder, file)
            os.remove(file_path)

if __name__ == "__main__":
    Cleaner.clean_up()

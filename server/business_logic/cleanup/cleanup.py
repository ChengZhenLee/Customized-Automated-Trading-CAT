import os
from config.constants import LOGGER_FILE, DATA_CSV

class Cleaner():
    def clean_up():
        if os.path.exists(DATA_CSV):
            os.remove(DATA_CSV)

        folder = (LOGGER_FILE.split('/'))[0]
        for file in os.listdir(folder):
            file_path = os.path.join(folder, file)
            os.remove(file_path)

if __name__ == "__main__":
    Cleaner.clean_up()

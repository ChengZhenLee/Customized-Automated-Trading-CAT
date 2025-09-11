from config.constants import PLOT_FILE

class Plot():
    def get_plot_filename(timestamp):
        name = (PLOT_FILE.split('.'))[0]
        return name + "_" + timestamp + "." + (PLOT_FILE.split('.'))[1]
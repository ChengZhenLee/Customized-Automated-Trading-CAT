from flask import Flask

app = Flask(__name__)

@app.route('/backtrader', method = ["POST"])
def run_backtester():
    configs = request.get_json()
    check_inputs(configs)


if __name__ == "__main__":
    app.run(debug=True)
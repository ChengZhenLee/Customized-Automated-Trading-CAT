from flask import Flask

app = Flask(__name__)

@app.route('/backtrader')
def home():
    return "Hello, this is your backend speaking"

if __name__ == "__main__":
    app.run(debug=True)
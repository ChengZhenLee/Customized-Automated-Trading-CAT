import sys
from backend.flask_app import flask_app
from backend.celery_app import celery_app
from backend.constants.constants import FLASK_PORT

def run_flask():
    flask_app.run(host='0.0.0.0', port=FLASK_PORT, debug=True)
    
def run_celery():
    celery_app.worker_main(["worker", "--pool=solo", "--loglevel=info"])

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run.py [flask|celery]")
        sys.exit(1)
        
    command = sys.argv[1].lower()
    
    if command == "flask":
        run_flask()
    elif command == "celery":
        run_celery()
    else:
        print(f"Unknown command: {command}")
        print("Usage: python run.py [flask|celery]")
        sys.exit(1)
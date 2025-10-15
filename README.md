# Automated Trading Backtesting Platform

This project is a full-stack web application for configuring, running, and analyzing automated trading strategies and signals. It features a React frontend and a Python backend with Flask and Celery for asynchronous backtesting.

## Features

- **Drag-and-drop interface** for selecting signals and strategies
- **User authentication** and config storage (Firebase)
- **Asynchronous backtesting** using Celery and Backtrader
- **Result visualization** and download (plots, logs)
- **Configurable strategies and signals**

## Project Structure

```
.
├── client/           # React frontend (Vite)
├── server/           # Python backend (Flask, Celery, Backtrader)
├── available_configs.txt
├── example_configs.json
├── run_commands.txt
├── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (for frontend)
- Python 3.8+ (for backend)
- Redis (for Celery broker)
- (Optional) Firebase account

### Setup

#### 1. Install dependencies

**Frontend:**
```sh
cd client
npm install
```

**Backend:**
```sh
cd server
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
```

#### 2. Start Redis

```sh
docker run -d -p 6379:6379 redis
```

#### 3. Run the backend

```sh
cd server
python run.py flask
python run.py celery
```

#### 4. Run the frontend

```sh
cd client
npm run dev
```

## Usage

- Register or log in via the web UI.
- Create and save trading configs.
- Submit configs for backtesting.
- View/download logs and plots of results.

## Configuration

- **Signals and strategies**: Defined in `available_configs.txt` and frontend config files.
- **API keys**: Place in `server/keys.json`.
- **Backtest results**: Stored in `server/backtest_runs/`.

## License

MIT (or specify your license)
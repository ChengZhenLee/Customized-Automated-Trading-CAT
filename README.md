# Automated Trading Backtesting Platform

This project is a full-stack web application for configuring, running, and analyzing automated trading strategies and signals. It features a React frontend and a Python backend with Flask and Celery for asynchronous backtesting. Uses Alpaca to retrieve historical stock data.

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
├── .gitignore
```

## Getting Started

### Prerequisites
- Node.js (for frontend)
- Python 3.8+ (for backend)
- Redis (for Celery broker)
- Alpaca account
- Firebase account

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

#### 2. Include Alpaca API keys
1. Create an Alpaca account at https://app.alpaca.markets/account/login.

2. In the `server/` directory, create a file named `.env`.

3. Add your Alpaca credentials into `.env` according to the template shown in `server/.env.example`:
```env
ALPACA_API_KEY=your_alpaca_api_key
ALPACA_SECRET_KEY=your_alpaca_secret_key
```

#### 3. Include Firebase API keys
1. Go to https://console.firebase.google.com/ and create a new project.

2. In the Firebase project settings, navigate to the **General** tab and locate the **Firebase SDK snippet**.

3. Copy the `firebaseConfig` object from the **Firebase SDK snippet**.

4. In the `client/` directory, create a file named `.env`.

4. Add your `firebaseConfig` into `.env` according to the template shown in `client/.env.example`:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_ID
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_ID
VITE_FIREBASE_APP_ID=your_firebase_app_ID
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_ID
```

#### 4. Start Redis

```sh
docker run -d -p 6379:6379 redis
```

#### 5. Run the backend

```sh
cd server
python run.py flask
python run.py celery
```

#### 6. Run the frontend

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
- **API keys**: Managed via `.env` files in both `/client` and `/server`.
- **Automatic sync**: On startup, the backend generates a local `keys.json` from your environment variables to maintain compatibility with the trading logic.
- **Backtest results**: Stored in `server/backtest_runs/`.

## Notes
- **Redis**: Ensure Redis is running before starting the backend.
```sh
docker run -d -p 6379:6379 redis
```

- **API Keys Security**: Ensure both `client/.env` and `server/.env` are added to your `.gitignore`. The project includes a `keys.json` ignore rule by default to prevent accidental credential leaks.

- **Headless Plotting**: The backtester is configured for headless environments (Docker/Servers). Plots are saved directly to the task directory as `.png` files.

- **Temporary Files**: Backtest results are stored in `backtest_runs/` and are automatically deleted after retrieval by the frontend or after an error in the computation is encountered.

- **Example Configurations**: Use `example_configs.json` as a reference for creating your own trading configuration.

- **Testing**: To test the backtester, run this command in the directory `server/`:
```sh
python -m business_logic.core.main_logic
```
The backtester will use the configurations stored in `server/backtest_runs/test`, and store its results in `server/backtest_runs/test` as well.

## Maintenance

### Cleaning up test files
The backtester generates temporary data in `server/backtest_runs/`. To manually clear the test directory:
```sh
# Ensure you have the right permissions
python -m business_logic.cleanup.cleaner
```

## Demonstration Video
https://github.com/user-attachments/assets/85fb1136-ebdb-4e41-966b-7c5ed8e6fd58


# Automated Trading Backtesting Platform

This project is a full-stack web application for configuring, running, and analyzing automated trading strategies and signals. It features a React frontend and a Python backend with Flask and Celery for asynchronous backtesting. Uses Alpaca to retrieve historical stock data

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

#### 2. Include Alpaca API keys
1. Create an Alpaca account at https://app.alpaca.markets/account/login.

2. In the `server/` directory, create a file named `keys.json`.

3. Add your API keys in the following format:
```json
{
    "ALPACA_API_KEY": "Your Alpaca API Key",

    "ALPACA_SECRET_KEY": "Your Alpaca Secret Key"
}
```

#### 3. Include Firebase API keys
1. Go to https://console.firebase.google.com/ and create a new project.

2. In the Firebase project settings, navigate to the **General** tab and locate the **Firebase SDK snippet**.

3. Copy the `firebaseConfig` object from the **Firebase SDK snippet**.

4. Replace the `firebaseConfig` in `client/src/firebase/firebaseApp.js` with your own configuration:
```javascript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

export const app = initializeApp(firebaseConfig);
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
- **API keys**: Place in `server/keys.json`.
- **Backtest results**: Stored in `server/backtest_runs/`. Any results are deleted automatically after a corresponding GET request from the frontend.

## Notes
- Ensure Redis is running before starting the backend.
- DO NOT commit API keys from `keys.json` and `firebaseApp.js` to version control for security reasons.
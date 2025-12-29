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
├── docker-compose.yaml
├── .dockerignore
├── .gitignore
├── README.md
```

## Getting Started

### Prerequisites 
- Alpaca account
- Firebase account
- Docker Desktop installed and running


#### 1. Include Alpaca API keys
1. Create an Alpaca account at https://app.alpaca.markets/account/login.

2. In the `server/` directory, create a file named `.env`.

3. Add your Alpaca credentials into `.env` according to the template shown in `server/.env.example`:
```env
ALPACA_API_KEY=your_alpaca_api_key
ALPACA_SECRET_KEY=your_alpaca_secret_key
```

#### 2. Include Firebase API keys
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

#### 3. Launch with Docker
Run this command in the terminal on the root directory
```sh
docker-compose up --build
```

#### 4. Access the App
The app will be available at:
- Frontend (Vite) at `http://localhost:5173`
- Backend (Flask) at `http://localhost:5000`

#### 5. Stop the App
- Run this command in the terminal on the root directory to stop the app and remove the container
```sh
docker-compose down
```

- Run this command to stop the app, remove the container and delete the shared backtest_data volume
```sh
docker-compose down -v
```

- Run this command to stop the app without removing the container
```sh
docker-compose stop
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
- **API Keys Security**: Ensure both `client/.env` and `server/.env` are added to your `.gitignore`. The project includes a `keys.json` ignore rule by default to prevent accidental credential leaks.

- **Headless Plotting**: The backtester is configured for headless environments (Docker/Servers). Plots are saved directly to the task directory as `.png` files.

- **Temporary Files**: Backtest results are stored in `backtest_runs/` and are automatically deleted after retrieval by the frontend or after an error in the computation is encountered.

- **Example Configurations**: Use `example_configs.json` as a reference for creating your own trading configuration.

- **Testing**: To test the backtester, run this command in the root directory:
```sh
docker-compose exec backend python -m business_logic.core.main_logic
```
The backtester will use the configurations stored in `server/backtest_runs/test`, and store its results in `server/backtest_runs/test` as well.

- **Ports**: To change ports, modify the `ports:` section in `docker-compose.yml`. For example, change `"5000:5000"` to `"8080:5000"` to access the backend (Flask) on port 8080.

## Maintenance

### Cleaning up test files
Testing the backtester generates temporary data in `server/backtest_runs/`. To manually clear the test directory:
```sh
docker-compose exec backend python -m business_logic.cleanup.cleaner
```

## Demonstration Video
https://github.com/user-attachments/assets/85fb1136-ebdb-4e41-966b-7c5ed8e6fd58
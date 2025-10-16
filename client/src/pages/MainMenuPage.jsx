import "./MainMenuPage.css";
import { Header } from "../components/header/Header";

export function MainMenuPage() {
    return (
        <>
            <Header />

            <div className="content-container">
                <h1 id="automated-trading-backtesting-platform">Automated Trading Backtesting Platform</h1>
                <p>This project is a full-stack web application for configuring, running, and analyzing automated trading strategies and signals. It features a React frontend and a Python backend with Flask and Celery for asynchronous backtesting. Uses Alpaca to retrieve historical stock data</p>
                <h2 id="features">Features</h2>
                <ul>
                    <li><strong>Drag-and-drop interface</strong> for selecting signals and strategies</li>
                    <li><strong>User authentication</strong> and config storage (Firebase)</li>
                    <li><strong>Asynchronous backtesting</strong> using Celery and Backtrader</li>
                    <li><strong>Result visualization</strong> and download (plots, logs)</li>
                    <li><strong>Configurable strategies and signals</strong></li>
                </ul>
            </div>
        </>

    )
}
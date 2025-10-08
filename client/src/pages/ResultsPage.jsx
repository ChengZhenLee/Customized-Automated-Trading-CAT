import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStorageResults, setStorageResults } from "../storedData";
import { useResultsStaleContext } from "../hooks/useResultsStaleContext";

export function ResultsPage() {
    const location = useLocation();
    const statusUrlRef = useRef(location.state?.data?.status_url);
    const [finalData, setFinalData] = useState(null);
    const [pollStatus, setPollStatus] = useState("pending");
    const { resultsStale, setResultsStale } = useResultsStaleContext();

    useEffect(() => {
        // Try to retrieve cached results
        const cachedResults = getStorageResults();
        // If there are already results cached
        if (cachedResults && !resultsStale) {
            setFinalData(getStorageResults());
            setPollStatus("success");
            return;
        }

        // If there were no cached results and no valid status url
        if (!statusUrlRef.current) {
            setPollStatus("fail");
            return;
        }

        // The polling function
        async function pollResults() {
            const response = await axios.get(statusUrlRef.current);
            const statusCode = response.status;

            // The task is completed and successful
            if (statusCode === 200 && response.data.status === "completed") {
                if (response.data.status === "completed") {
                    setPollStatus("success");
                    setFinalData(response.data);
                    setStorageResults(response.data);
                    setResultsStale(false);
                    return;
                }
                // There was an issue in the backend 
            } else if (statusCode === 500) {
                setPollStatus("fail");
            }

            // Poll again after 5 second
            setTimeout(pollResults, 5000);
        }

        // Start polling for the results if the results is stale
        if (resultsStale) {
            pollResults();
        }
    }, [location, statusUrlRef, resultsStale, setResultsStale]);

    return (
        <>
            {pollStatus === "success" && (
                <>
                    <Results finalData={finalData} />
                    <NavButtons />
                </>
            )}
            {pollStatus === "pending" && (
                <div>
                    Loading...
                </div>
            )}
            {pollStatus === "fail" && (
                <>
                    <div>
                        Unable to perform backtest and fetch results. Please resubmit a config.
                    </div>
                    <NavButtons />
                </>
            )}
        </>
    );
}

export function Plot({ plotData }) {
    return (
        <img src={`data:image/jpeg;base64,${plotData}`}></img>
    );
}

export function Results({ finalData }) {
    const plotData = finalData.plot_data;
    const logData = finalData.log_data;
    const configsData = finalData.configs;
    return (
        <div>
            <div>
                <RenderConfigs configsData={configsData} />
            </div>

            <div>
                <Plot plotData={plotData} />
            </div>

            <div>
                <DownloadLog logData={logData} />
            </div>
        </div>
    );
}

export function RenderConfigs({ configsData }) {
    const traderSettings = configsData.trader_settings;
    const optimize = traderSettings.optimize;
    const dataSettings = configsData.data_settings;
    const signals = configsData.signals;
    const strategies = configsData.strategies;

    return (
        <div>
            <RenderTraderSettings traderSettings={traderSettings} />
            <RenderDataSettings dataSettings={dataSettings} />
            <RenderSignals signals={signals} optimize={optimize} />
            <RenderStrategies strategies={strategies} optimize={optimize} />
        </div>
    )
}

export function RenderTraderSettings({ traderSettings }) {
    const commission = traderSettings.commission;
    const size = traderSettings.size;
    const startingCash = traderSettings.starting_cash;

    return (
        <div>
            <h1>Trader Settings</h1>
            <p>Starting Cash: ${startingCash}</p>
            <p>Trading Size: {size} {size === 1 ? "stock" : "stocks"}</p>
            <p>Commission to Broker: ${commission}</p>
        </div>
    );
}

export function RenderDataSettings({ dataSettings }) {
    const startTime = dataSettings.start_time;
    const endTime = dataSettings.end_time;
    const symbol = dataSettings.symbols_to_trade;
    const timeframe = dataSettings.timeframe;

    return (
        <div>
            <h1>Data Settings</h1>
            <p>Stock Symbol Traded: {symbol}</p>
            <p>Starting Time: {startTime.year} {MonthMap[startTime.month]} {startTime.day}</p>
            <p>Ending Time: {endTime.year} {MonthMap[endTime.month]} {endTime.day}</p>
            <p>Timeframe used: {timeframe}</p>
        </div>
    );
}

export function RenderSignals({ signals, optimize }) {
    const key = optimize ? "all_signal_optimize_params" : "all_signal_params";
    const allParams = signals[key];

    return (
        <div>
            <h1>Signals and Parameters used:</h1>
            {Object.keys(allParams).map((signal) => {
                return (
                    <div key={signal}>
                        Signal: {SignalNameMap[signal]}
                        {Object.keys(allParams[signal]).map((param) => {
                            return (
                                <div key={`${signal}-${param}`}>
                                    {SignalParamNameMap[signal][param]}: {allParams[signal][param]}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export function RenderStrategies({ strategies, optimize }) {
    const key = optimize ? "all_strategy_optimize_params" : "all_strategy_params";
    const names = strategies.strategy_names;
    const allParams = strategies[key];
    console.log(allParams);

    return (
        <div>
            <h1>Strategies and Parameters used:</h1>
            {names.map((strategy) => {
                return (
                    <div key={strategy}>
                        Strategy: {StrategyNameMap[strategy]}
                        {allParams[strategy] && Object.keys(allParams[strategy]).map((param) => {
                            return (
                                <div key={`${strategy}-${param}`}>
                                    {SignalParamNameMap[strategy][param]}: {allParams[strategy][param]}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export function DownloadLog({ logData }) {

}

export function NavButtons() {
    const navigate = useNavigate();

    return (
        <>
            <div>
                <button
                    onClick={() => navigate("/")}>
                    Go to Main Menu
                </button>

                <button
                    onClick={() => navigate("/myconfigs")}>
                    Go to Your Configs
                </button>

                <button
                    onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                </button>
            </div>
        </>
    );
}

const SignalNameMap = {
    "sma": "Simple Moving Average Crossover Signal",
    "rsi": "Relative Strength Index (RSI) Signal"
}

const SignalParamNameMap = {
    "sma": {
        "fast": "Fast Moving Average",
        "slow": "Slow Moving Average"
    },

    "rsi": {
        "period": "RSI Period",
        "overbought": "RSI Overbought Level",
        "oversold": "RSI Oversold Level"
    }
}

const StrategyNameMap = {
    "single": "Single Position",
    "dca": "Dollar Cost Averaging Strategy",
    "duration": "Duration in Position Strategy",
    "pricediff": "Price Difference Strategy"
}

const StrategyParamNameMap = {
    "duration": {
        "duration": "Duration in Position"
    },

    "pricediff": {
        "initial_entry_price": "Initial Entry Price",
        "price_drop_pct": "Price Drop in Percentage",
        "price_rise_pct": "Price Rise in Percentage"
    }
}

const MonthMap = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mac",
    "4": "Apr",
    "5": "May",
    "6": "Jun",
    "7": "Jul",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
}
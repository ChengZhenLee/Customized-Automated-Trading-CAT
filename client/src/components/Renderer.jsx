import { MonthMap } from "../constants/maps/MonthMap";
import { SignalNameMap, SignalParamNameMap } from "../constants/maps/SignalMaps";
import { StrategyNameMap, StrategyParamNameMap } from "../constants/maps/StrategyMaps";

export function RenderConfigs({ configsData }) {
    const traderSettings = configsData.trader_settings;
    const dataSettings = configsData.data_settings;
    const signals = configsData.signals;
    const strategies = configsData.strategies;

    const optimize = traderSettings.optimize;

    return (
        <div>
            <RenderTraderSettings traderSettings={traderSettings} />
            <RenderDataSettings dataSettings={dataSettings} />
            <RenderSignals signals={signals} optimize={optimize} />
            <RenderStrategies strategies={strategies} optimize={optimize} />
        </div>
    )
}

function RenderTraderSettings({ traderSettings }) {
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

function RenderDataSettings({ dataSettings }) {
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

function RenderSignals({ signals, optimize }) {
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

function RenderStrategies({ strategies, optimize }) {
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
                                    {StrategyParamNameMap[strategy][param]}: {allParams[strategy][param]}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
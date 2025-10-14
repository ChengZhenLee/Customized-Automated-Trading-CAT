import "./Renderer.css";
import { MonthMap } from "../constants/maps/MonthMap";
import { SignalNameMap, SignalParamNameMap } from "../constants/maps/SignalMaps";
import { StrategyNameMap, StrategyParamNameMap } from "../constants/maps/StrategyMaps";

export function RenderConfigs({ configsData }) {
    const configName = configsData.config_name;
    const traderSettings = configsData.trader_settings;
    const dataSettings = configsData.data_settings;
    const signals = configsData.signals;
    const strategies = configsData.strategies;

    const optimize = traderSettings.optimize;

    return (
        <div className="settings-details-container">
            <RenderConfigName configName={configName} />
            <RenderTraderSettings traderSettings={traderSettings} />
            <RenderDataSettings dataSettings={dataSettings} />
            <RenderSignals signals={signals} optimize={optimize} />
            <RenderStrategies strategies={strategies} optimize={optimize} />
        </div>
    )
}

function RenderConfigName({ configName }) {
    return (
        <div className="setting-details-container">
            {configName ?
                (
                    <div className="setting-title">Config Name: {configName}</div>
                ) :
                <div className="setting-title">No Config Name</div>
            }
        </div>
    );

}

function RenderTraderSettings({ traderSettings }) {
    const commission = traderSettings.commission;
    const size = traderSettings.size;
    const startingCash = traderSettings.starting_cash;

    return (
        <div className="setting-details-container">
            <div className="setting-title">Trader Settings</div>
            <div>Starting Cash: ${startingCash}</div>
            <div>Trading Size: {size} {size === 1 ? "stock" : "stocks"}</div>
            <div>Commission to Broker: ${commission}</div>
        </div>
    );
}

function RenderDataSettings({ dataSettings }) {
    const startTime = dataSettings.start_time;
    const endTime = dataSettings.end_time;
    const symbol = dataSettings.symbols_to_trade;
    const timeframe = dataSettings.timeframe;

    return (
        <div className="setting-details-container">
            <div className="setting-title">Data Settings</div>
            <div>Stock Symbol Traded: {symbol}</div>
            <div>Starting Time: {startTime?.year} {MonthMap[startTime?.month]} {startTime?.day}</div>
            <div>Ending Time: {endTime?.year} {MonthMap[endTime?.month]} {endTime?.day}</div>
            <div>Timeframe used: {timeframe}</div>
        </div>
    );
}

function RenderSignals({ signals, optimize }) {
    const key = optimize ? "all_signal_optimize_params" : "all_signal_params";
    const allParams = signals[key];

    return (
        <div className="setting-details-container">
            <div className="setting-title">Signals and Parameters used:</div>
            {Object.keys(allParams).map((signal) => {
                return (
                    <div key={signal} className="single-details-container">
                        <div className="single-details-title">
                            {SignalNameMap[signal]}
                        </div>

                        <div className="param-details-container">
                            {Object.keys(allParams[signal]).map((param) => {
                                return (
                                    <div key={`${signal}-${param}`}>
                                        {SignalParamNameMap[signal][param]}: {
                                            optimize ?
                                                allParams[signal][param].join(", ") :
                                                allParams[signal][param]}
                                    </div>
                                );
                            })}
                        </div>
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
        <div className="setting-details-container">
            <div className="setting-title">Strategies and Parameters used:</div>
            {names.map((strategy) => {
                return (
                    <div key={strategy} className="single-details-container">
                        <div className="single-details-title">
                            {StrategyNameMap[strategy]}
                        </div>

                        <div className="param-details-container">
                            {allParams[strategy] && Object.keys(allParams[strategy]).map((param) => {
                                return (
                                    <div key={`${strategy}-${param}`}>
                                        {StrategyParamNameMap[strategy][param]}: {
                                            optimize ?
                                                allParams[strategy][param].join(", ") :
                                                allParams[strategy][param]}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
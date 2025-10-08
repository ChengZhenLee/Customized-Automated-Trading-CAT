import download from "downloadjs";
import { RenderConfigs } from "./Renderer";

export function Results({ finalData }) {
    const configName = finalData.config_name;
    const plotData = finalData.plot_data;
    const logData = finalData.log_data;
    const configsData = finalData.configs;

    return (
        <div>
            <div>
                Config Name: {configName}
            </div>

            <div>
                <RenderConfigs configsData={configsData} />
            </div>

            <div>
                <Plot plotData={plotData} />
            </div>

            <div>
                <DownloadLog logData={logData} name={configName} />
            </div>
        </div>
    );
}

function Plot({ plotData }) {
    return (
        <img src={`data:image/jpeg;base64,${plotData}`}></img>
    );
}

export function DownloadLog({ logData, name }) {
    const blob = new Blob([logData], {
        type: "text/plain"
    });

    const filename = name ? 
        `backtest_logs_${name}_${new Date().toISOString()}.txt` :
        `backtest_logs_${new Date().toISOString()}.txt`;

    return (
        <div>
            <button
                onClick={() => download(blob, filename)}>
                Download Log File
            </button>
        </div>
    );
}
import "./Results.css";
import download from "downloadjs";
import { RenderConfigs } from "./Renderer";

export function Results({ finalData }) {
    const plotData = finalData.plot_data;
    const logData = finalData.log_data;
    const configsData = finalData.config;

    return (
        <>
            <div className="download-buttons">
                <DownloadLog logData={logData} name={configsData.config_name} />
                <DownloadPlot potData={plotData} name={configsData.config_name} />
            </div>
            
            <Plot plotData={plotData} />

            <div className="below-plot-container">
                <RenderConfigs configsData={configsData} />

            </div>


        </>
    );
}

function Plot({ plotData }) {
    return (
        <div className="plot-container">
            {
                plotData && (
                    <img src={`data:image/jpeg;base64,${plotData}`}></img>
                )
            }
        </div>
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
        <button
            onClick={() => download(blob, filename)}>
            Download Log File
        </button>
    );
}

export function DownloadPlot({ plotData, name }) {
    const blob = new Blob([plotData], {
        type: "image/png"
    });

    const filename = name ?
        `backtest_plot_${name}_${new Date().toISOString()}.txt` :
        `backtest_plot${new Date().toISOString()}.txt`;

    return (
        <button
            onClick={() => download(blob, filename)}>
            Download Plot
        </button>
    );
}
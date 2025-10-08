export function setStorageResults(data) {
    sessionStorage.setItem("BacktestResult", JSON.stringify(data));
}

export function getStorageResults() {
    return JSON.parse(sessionStorage.getItem("BacktestResult"));
}
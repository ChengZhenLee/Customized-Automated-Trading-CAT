import { useContext } from "react";
import { ResultsStaleContext } from "../context/ResultsStaleContext";

export function useResultsStaleContext() {
    return useContext(ResultsStaleContext);
}
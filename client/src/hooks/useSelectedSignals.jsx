import { useContext } from "react";
import { SelectedSignalsContext } from "../context/SelectedSignalsContext";

export function useSelectedSignals() {
    return useContext(SelectedSignalsContext);
}
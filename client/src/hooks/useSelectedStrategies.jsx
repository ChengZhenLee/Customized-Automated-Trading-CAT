import { useContext } from "react";
import { SelectedStrategiesContext } from "../context/SelectedStrategiesContext";

export function useSelectedStrategies() {
    return (useContext(SelectedStrategiesContext));
}
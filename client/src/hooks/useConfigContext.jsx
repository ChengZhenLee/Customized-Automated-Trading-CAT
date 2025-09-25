import { useContext } from "react";
import { ConfigContext } from "../context/ConfigContext";

export function useConfigContext() {
    return useContext(ConfigContext);
}
import { useContext } from "react";
import { CoordinatesContext } from "./CoordinatesContext";

export default function useCoordinates() {
  const context = useContext(CoordinatesContext);
  if (!context) {
    throw new Error("useCoordinates must be used within a CoordinatesProvider");
  }
  return context;
}

import { createContext, ReactNode, useState } from "react";

type CoordinatesTypes = {
  _id: string;
  coordinatesX: number;
  coordinatesY: number;
};

type CoordinatesContextTypes = {
  coordinates: CoordinatesTypes;
  setCoordinates: React.Dispatch<React.SetStateAction<CoordinatesTypes>>;
} | null;

export const CoordinatesContext = createContext<CoordinatesContextTypes>(null);

type CoordinatesProviderTypes = {
  children: ReactNode;
};

export function CoordinatesProvider({ children }: CoordinatesProviderTypes) {
  const [coordinates, setCoordinates] = useState<CoordinatesTypes>({
    _id: "",
    coordinatesX: 0,
    coordinatesY: 0,
  });

  return (
    <CoordinatesContext.Provider value={{ coordinates, setCoordinates }}>
      {children}
    </CoordinatesContext.Provider>
  );
}

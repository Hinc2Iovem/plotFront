import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createPlotfieldCommandInfoSlice, PlotfieldCommandInfoSliceTypes } from "./PlotfieldCommandInfoSlice";
import { createPlotfieldCommandSlice, CreatePlotfieldCommandSliceTypes } from "./PlotfieldCommandSlice";

type UsePlotfieldCommandsStoreTypes = PlotfieldCommandInfoSliceTypes & CreatePlotfieldCommandSliceTypes;

const usePlotfieldCommands = create<UsePlotfieldCommandsStoreTypes>()(
  devtools(
    (...a) => ({
      ...createPlotfieldCommandSlice(...a),
      ...createPlotfieldCommandInfoSlice(...a),
    }),
    { name: "PlotfieldName", store: "PlotfieldStore" }
  )
);

export default usePlotfieldCommands;

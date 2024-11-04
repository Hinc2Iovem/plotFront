import { create } from "zustand";
import {
  createPlotfieldCommandIfInfoSlice,
  PlotfieldCommandIfInfoSliceTypes,
} from "./PlotfieldCommandIfInfoSlice";
import {
  CreatePlotfieldCommandIfSliceTypes,
  createPlotfieldIfCommandSlice,
} from "./PlotfieldCommandIfSlice";
import {
  createPlotfieldCommandInfoSlice,
  PlotfieldCommandInfoSliceTypes,
} from "./PlotfieldCommandInfoSlice";
import {
  createPlotfieldCommandSlice,
  CreatePlotfieldCommandSliceTypes,
} from "./PlotfieldCommandSlice";
import { devtools } from "zustand/middleware";

type UsePlotfieldCommandsStoreTypes = PlotfieldCommandIfInfoSliceTypes &
  PlotfieldCommandInfoSliceTypes &
  CreatePlotfieldCommandSliceTypes &
  CreatePlotfieldCommandIfSliceTypes;

const usePlotfieldCommands = create<UsePlotfieldCommandsStoreTypes>()(
  devtools(
    (...a) => ({
      ...createPlotfieldCommandSlice(...a),
      ...createPlotfieldCommandInfoSlice(...a),
      ...createPlotfieldIfCommandSlice(...a),
      ...createPlotfieldCommandIfInfoSlice(...a),
    }),
    { name: "PlotfieldName", store: "PlotfieldStore" }
  )
);

export default usePlotfieldCommands;

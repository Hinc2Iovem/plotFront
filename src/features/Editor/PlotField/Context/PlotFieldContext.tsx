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

type UsePlotfieldCommandsStoreTypes = PlotfieldCommandIfInfoSliceTypes &
  PlotfieldCommandInfoSliceTypes &
  CreatePlotfieldCommandSliceTypes &
  CreatePlotfieldCommandIfSliceTypes;

const usePlotfieldCommands = create<UsePlotfieldCommandsStoreTypes>()(
  (...a) => ({
    ...createPlotfieldCommandSlice(...a),
    ...createPlotfieldCommandInfoSlice(...a),
    ...createPlotfieldIfCommandSlice(...a),
    ...createPlotfieldCommandIfInfoSlice(...a),
  })
);

export default usePlotfieldCommands;

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createIfVariationSlice, IfVariationSliceTypes } from "./IfVariationSlice";
import { CommandIfInfoSliceTypes, createIfInfoSlice } from "./IfInfoSlice";

type UseCommandIfTypes = IfVariationSliceTypes & CommandIfInfoSliceTypes;

const useCommandIf = create<UseCommandIfTypes>()(
  devtools(
    (...a) => ({
      ...createIfVariationSlice(...a),
      ...createIfInfoSlice(...a),
    }),
    { name: "CommandIfName", store: "CommandIfStore" }
  )
);

export default useCommandIf;

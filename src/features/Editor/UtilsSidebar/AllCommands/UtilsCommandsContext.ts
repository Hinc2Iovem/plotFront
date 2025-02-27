import { create } from "zustand";
import { devtools } from "zustand/middleware";

type UtilsStoreTypes = {
  hoveredRowNumber: string;
  setHoveredRowNumber: ({ rowNumber }: { rowNumber: string }) => void;
  clear: () => void;
};

const useUtils = create<UtilsStoreTypes>()(
  devtools(
    (set) => ({
      hoveredRowNumber: "",
      setHoveredRowNumber: ({ rowNumber }) =>
        set(() => ({
          hoveredRowNumber: rowNumber,
        })),
      clear: () =>
        set(() => ({
          hoveredRowNumber: "",
        })),
    }),
    { name: "UtilsName", store: "UtilsStore" }
  )
);

export default useUtils;

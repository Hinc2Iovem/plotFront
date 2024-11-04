import { create } from "zustand";
import { TopologyBlockTypes } from "../../../../types/TopologyBlock/TopologyBlockTypes";
import { devtools } from "zustand/middleware";

type TopologyBlockContextTypes = {
  topologyBlock: TopologyBlockTypes;
  updateTopologyBlock: ({
    newTopologyBlock,
  }: {
    newTopologyBlock: TopologyBlockTypes;
  }) => void;
  getTopologyBlock: () => TopologyBlockTypes;
  updateAmountOfChildBlocks: (sign: "add" | "minus") => void;
};

// let newName;
// if (sourceBlockName?.includes("-")) {
//   const newArray = sourceBlockName.split("-");
//   newName = newArray[0] + "-" + (Number(newArray[1]) + 1);
// } else {
//   newName = sourceBlockName + "-" + existingChoice.amountOfOptions;
// }

const useTopologyBlocks = create<TopologyBlockContextTypes>()(
  devtools(
    (set, get) => ({
      topologyBlock: {} as TopologyBlockTypes,
      updateTopologyBlock: ({ newTopologyBlock }) =>
        set(() => ({
          topologyBlock: newTopologyBlock,
        })),
      getTopologyBlock: () => {
        return get().topologyBlock;
      },
      updateAmountOfChildBlocks: (sign) =>
        set((state) => ({
          topologyBlock: {
            ...state.topologyBlock,
            topologyBlockInfo: {
              ...state.topologyBlock.topologyBlockInfo,
              amountOfChildBlocks:
                sign === "add"
                  ? state.topologyBlock.topologyBlockInfo.amountOfChildBlocks +
                    1
                  : Math.max(
                      state.topologyBlock.topologyBlockInfo
                        .amountOfChildBlocks - 1,
                      0
                    ),
            },
          },
        })),
    }),
    { name: "TopologyBlockName", store: "TopologyBlockStore" }
  )
);

export default useTopologyBlocks;

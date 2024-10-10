import { create } from "zustand";
import { TopologyBlockTypes } from "../../../../types/TopologyBlock/TopologyBlockTypes";

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

const useTopologyBlocks = create<TopologyBlockContextTypes>()((set, get) => ({
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
              ? state.topologyBlock.topologyBlockInfo.amountOfChildBlocks + 1
              : Math.max(
                  state.topologyBlock.topologyBlockInfo.amountOfChildBlocks - 1,
                  0
                ),
        },
      },
    })),
}));

export default useTopologyBlocks;

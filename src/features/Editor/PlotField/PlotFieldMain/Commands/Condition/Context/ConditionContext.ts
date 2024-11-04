import { create } from "zustand";
import {
  ConditionBlockTypes,
  ConditionSignTypes,
  ConditionValueVariationType,
} from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import { devtools } from "zustand/middleware";

export type ConditionBlockItemTypes = {
  conditionBlockId: string;
  isElse: boolean;
  targetBlockId: string;
  topologyBlockName?: string;
  conditionName?: string;
  conditionValue?: string | null;
  sign?: ConditionSignTypes;
  orderOfExecution: number | null;
  conditionType: ConditionValueVariationType;
  characterId?: string;
  appearancePartId?: string;
  characteristicId?: string;
  commandKeyId?: string;
};

type CommandConditionStoreTypes = {
  conditions: {
    conditionId: string;
    plotfieldCommandId: string;
    currentlyOpenConditionBlockPlotId: string;
    conditionBlocks: ConditionBlockItemTypes[];
  }[];
  setConditionId: ({
    conditionId,
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
    conditionId: string;
  }) => void;
  setConditionBlocks: ({
    conditionBlocks,
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
    conditionBlocks: ConditionBlockTypes[];
  }) => void;
  addConditionBlock: ({
    conditionBlock,
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
    conditionBlock: ConditionBlockItemTypes;
  }) => void;
  updateConditionBlockTargetBlockId: ({
    conditionBlockId,
    targetBlockId,
    plotfieldCommandId,
    topologyBlockName,
  }: {
    topologyBlockName: string;
    conditionBlockId: string;
    plotfieldCommandId: string;
    targetBlockId: string;
  }) => void;
  updateConditionBlockType: ({
    conditionBlockId,
    conditionType,
    plotfieldCommandId,
  }: {
    conditionBlockId: string;
    plotfieldCommandId: string;
    conditionType: ConditionValueVariationType;
  }) => void;
  updateConditionBlockValueId: ({
    blockValueId,
    conditionBlockId,
    conditionType,
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
    conditionBlockId: string;
    blockValueId: string;
    conditionType: ConditionValueVariationType;
  }) => void;
  updateConditionBlockName: ({
    conditionBlockId,
    conditionName,
    plotfieldCommandId,
  }: {
    conditionBlockId: string;
    plotfieldCommandId: string;
    conditionName: string;
  }) => void;
  updateConditionBlockValue: ({
    conditionBlockId,
    conditionValue,
    plotfieldCommandId,
  }: {
    conditionBlockId: string;
    plotfieldCommandId: string;
    conditionValue: string;
  }) => void;
  updateConditionBlockSign: ({
    conditionBlockId,
    sign,
    plotfieldCommandId,
  }: {
    conditionBlockId: string;
    plotfieldCommandId: string;
    sign: ConditionSignTypes;
  }) => void;
  updateConditionOrderOfExecution: ({
    conditionBlockId,
    orderOfExecution,
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
    conditionBlockId: string;
    orderOfExecution: number;
  }) => void;
  updateCurrentlyOpenConditionBlock: ({
    plotfieldCommandId,
    conditionBlockId,
  }: {
    plotfieldCommandId: string;
    conditionBlockId: string;
  }) => void;
  getAllUsedOrders: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => number[];
  getAllConditionBlocksElseOrIfByPlotfieldCommandId: ({
    plotfieldCommandId,
    isElse,
  }: {
    plotfieldCommandId: string;
    isElse: boolean;
  }) => ConditionBlockItemTypes | ConditionBlockItemTypes[] | null;
  getAmountOfConditionBlocks: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => number;
  getAmountOfOnlyIfConditionBlocks: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => number;
  getCurrentlyOpenConditionBlockPlotId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => string;
  getAllConditionBlocksByPlotfieldCommandId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ConditionBlockItemTypes[];
  getFirstConditionBlockWithTopologyBlockId: ({
    plotfieldCommandId,
    insideElse,
  }: {
    plotfieldCommandId: string;
    insideElse: boolean;
  }) => ConditionBlockItemTypes | null;
  getConditionBlockById: ({
    conditionBlockId,
    plotfieldCommandId,
  }: {
    conditionBlockId: string;
    plotfieldCommandId: string;
  }) => ConditionBlockItemTypes | null;
  getConditionBlockName: ({
    plotfieldCommandId,
    conditionBlockId,
  }: {
    plotfieldCommandId: string;
    conditionBlockId: string;
  }) => string;
  getIndexOfConditionBlockById: ({
    plotfieldCommandId,
    conditionBlockId,
  }: {
    plotfieldCommandId: string;
    conditionBlockId: string;
  }) => number | null;
  getConditionBlockByIndex: ({
    plotfieldCommandId,
    index,
  }: {
    plotfieldCommandId: string;
    index: number;
  }) => ConditionBlockItemTypes | null;
  getCurrentlyOpenConditionBlock: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ConditionBlockItemTypes | null;
};

const useConditionBlocks = create<CommandConditionStoreTypes>()(
  devtools(
    (set, get) => ({
      conditions: [],
      getAmountOfConditionBlocks: ({ plotfieldCommandId }) => {
        const currentCondition = get().conditions.find(
          (c) => c.plotfieldCommandId === plotfieldCommandId
        );
        if (currentCondition) {
          return currentCondition.conditionBlocks.length;
        } else {
          return 0;
        }
      },
      getAmountOfOnlyIfConditionBlocks: ({ plotfieldCommandId }) => {
        const currentCondition = get()
          .conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.conditionBlocks.filter((c) => c.isElse !== true);
        if (currentCondition) {
          return currentCondition.length;
        } else {
          return 0;
        }
      },
      getAllUsedOrders: ({ plotfieldCommandId }) => {
        const allUsedOrders = [] as number[];
        get()
          .conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.conditionBlocks.map((cb) => {
            if (typeof cb.orderOfExecution === "number") {
              allUsedOrders.push(cb.orderOfExecution);
            }
          });
        return allUsedOrders;
      },
      getIndexOfConditionBlockById: ({
        plotfieldCommandId,
        conditionBlockId,
      }) => {
        const currentConditionBlocIndex = get()
          .conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.conditionBlocks.findIndex(
            (co) => co.conditionBlockId === conditionBlockId
          );

        if (typeof currentConditionBlocIndex === "number") {
          return currentConditionBlocIndex;
        } else {
          return null;
        }
      },
      getConditionBlockByIndex: ({ plotfieldCommandId, index }) => {
        const currentConditionBlocIndex = get().conditions.find(
          (c) => c.plotfieldCommandId === plotfieldCommandId
        )?.conditionBlocks[index];

        if (currentConditionBlocIndex) {
          return currentConditionBlocIndex;
        } else {
          return null;
        }
      },
      getConditionBlockName: ({ plotfieldCommandId, conditionBlockId }) => {
        const currentConditionBlockName = get()
          .conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.conditionBlocks.find(
            (co) => co.conditionBlockId === conditionBlockId
          )?.conditionName;

        if (currentConditionBlockName) {
          return currentConditionBlockName;
        } else {
          return "";
        }
      },
      getCurrentlyOpenConditionBlockPlotId: ({ plotfieldCommandId }) => {
        const currentlyOpenConditionBlockPlotId = get().conditions.find(
          (c) => c.plotfieldCommandId === plotfieldCommandId
        )?.currentlyOpenConditionBlockPlotId;
        if (currentlyOpenConditionBlockPlotId) {
          return currentlyOpenConditionBlockPlotId;
        } else {
          return "";
        }
      },
      getFirstConditionBlockWithTopologyBlockId: ({
        plotfieldCommandId,
        insideElse,
      }) => {
        const conditionBlocks = get().conditions.find(
          (c) => c.plotfieldCommandId === plotfieldCommandId
        )?.conditionBlocks;

        const blockToReturn = insideElse
          ? conditionBlocks?.find((c) => c.targetBlockId && c.isElse)
          : conditionBlocks?.find((c) => c.targetBlockId && !c.isElse);

        if (blockToReturn) {
          return blockToReturn;
        } else {
          return null;
        }
      },
      getAllConditionBlocksByPlotfieldCommandId: ({ plotfieldCommandId }) => {
        const conditionBlocks = get().conditions.find(
          (c) => c.plotfieldCommandId === plotfieldCommandId
        )?.conditionBlocks;
        if (conditionBlocks) {
          return conditionBlocks;
        } else {
          return [];
        }
      },
      getAllConditionBlocksElseOrIfByPlotfieldCommandId: ({
        plotfieldCommandId,
        isElse,
      }) => {
        if (isElse) {
          const conditionBlock = get()
            .conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
            ?.conditionBlocks.find((c) => c.isElse === true);
          if (conditionBlock) {
            return conditionBlock;
          } else {
            return null;
          }
        } else {
          const conditionBlocks = get()
            .conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
            ?.conditionBlocks.filter((c) => c.isElse !== true);
          if (conditionBlocks) {
            return conditionBlocks;
          } else {
            return [];
          }
        }
      },
      getCurrentlyOpenConditionBlock: ({ plotfieldCommandId }) => {
        const conditionBlock = get()
          .conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.conditionBlocks.find(
            (c) =>
              c.conditionBlockId ===
              get().conditions.find(
                (c) => c.plotfieldCommandId === plotfieldCommandId
              )?.currentlyOpenConditionBlockPlotId
          );
        if (conditionBlock) {
          return conditionBlock;
        } else {
          return null;
        }
      },
      getConditionBlockById: ({ plotfieldCommandId, conditionBlockId }) => {
        const conditionBlock = get()
          .conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.conditionBlocks.find(
            (c) => c.conditionBlockId === conditionBlockId
          );
        if (conditionBlock) {
          return conditionBlock;
        } else {
          return null;
        }
      },
      setConditionId: ({ plotfieldCommandId, conditionId }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionId,
                }
              : c
          ),
        })),
      updateConditionBlockTargetBlockId: ({
        plotfieldCommandId,
        conditionBlockId,
        targetBlockId,
        topologyBlockName,
      }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId
                      ? { ...co, targetBlockId, topologyBlockName }
                      : co
                  ),
                }
              : c
          ),
        })),
      updateCurrentlyOpenConditionBlock: ({
        plotfieldCommandId,
        conditionBlockId,
      }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  currentlyOpenConditionBlockPlotId: conditionBlockId,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId ? { ...co } : co
                  ),
                }
              : c
          ),
        })),
      updateConditionBlockValueId: ({
        plotfieldCommandId,
        conditionBlockId,
        blockValueId,
        conditionType,
      }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId
                      ? {
                          ...co,
                          appearancePartId:
                            conditionType === "appearance"
                              ? blockValueId
                              : co.appearancePartId || "",
                          characterId:
                            conditionType === "character"
                              ? blockValueId
                              : co.characterId || "",
                          characteristicId:
                            conditionType === "characteristic"
                              ? blockValueId
                              : co.characteristicId || "",
                          commandKeyId:
                            conditionType === "key"
                              ? blockValueId
                              : co.commandKeyId || "",
                        }
                      : co
                  ),
                }
              : c
          ),
        })),
      updateConditionBlockName: ({
        conditionBlockId,
        conditionName,
        plotfieldCommandId,
      }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId
                      ? {
                          ...co,
                          conditionName,
                        }
                      : co
                  ),
                }
              : c
          ),
        })),
      updateConditionBlockValue: ({
        conditionBlockId,
        conditionValue,
        plotfieldCommandId,
      }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId
                      ? {
                          ...co,
                          conditionValue,
                        }
                      : co
                  ),
                }
              : c
          ),
        })),
      updateConditionBlockSign: ({
        conditionBlockId,
        sign,
        plotfieldCommandId,
      }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId
                      ? {
                          ...co,
                          sign,
                        }
                      : co
                  ),
                }
              : c
          ),
        })),
      addConditionBlock: ({ conditionBlock, plotfieldCommandId }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.find(
                    (co) =>
                      co.conditionBlockId === conditionBlock.conditionBlockId
                  )
                    ? c.conditionBlocks
                    : [...c.conditionBlocks, conditionBlock],
                }
              : c
          ),
        })),
      setConditionBlocks: ({ conditionBlocks, plotfieldCommandId }) =>
        set((state) => {
          const existingCondition = state.conditions.find(
            (c) => c.plotfieldCommandId === plotfieldCommandId
          );
          if (existingCondition) {
            return {
              conditions: state.conditions.map((c) =>
                c.plotfieldCommandId === plotfieldCommandId
                  ? {
                      ...c,
                      conditionBlocks: conditionBlocks.map((co) => ({
                        conditionBlockId: co._id,
                        orderOfExecution: co.orderOfExecution || null,
                        conditionName: co.name || "",
                        conditionType: co.type,
                        targetBlockId: co.targetBlockId || "",
                        topologyBlockName: "",
                        isElse: co.isElse || false,
                        conditionValue: co.value || null,
                        sign: co.sign || null,
                        characterId: co.characterId || "",
                        characteristicId: co.characteristicId || "",
                        appearancePartId: co.appearancePartId || "",
                        commandKeyId: co.commandKeyId || "",
                      })),
                    }
                  : c
              ),
            };
          } else {
            return {
              conditions: [
                ...state.conditions,
                {
                  conditionId: "",
                  plotfieldCommandId,
                  conditionBlocks: conditionBlocks.map((co) => ({
                    conditionBlockId: co._id,
                    orderOfExecution: co.orderOfExecution || null,
                    conditionName: co.name || "",
                    conditionType: co.type,
                    targetBlockId: co.targetBlockId,
                    topologyBlockName: "",
                    isElse: co.isElse || false,
                    conditionValue: co.value || null,
                    sign: co.sign || null,
                    characterId: co.characterId || "",
                    characteristicId: co.characteristicId || "",
                    appearancePartId: co.appearancePartId || "",
                    commandKeyId: co.commandKeyId || "",
                  })),
                  currentlyOpenConditionBlockPlotId: "",
                },
              ],
            };
          }
        }),
      updateConditionOrderOfExecution: ({
        conditionBlockId,
        orderOfExecution,
        plotfieldCommandId,
      }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) => {
                    if (
                      co.orderOfExecution === orderOfExecution &&
                      conditionBlockId !== co.conditionBlockId
                    ) {
                      return { ...co, orderOfExecution: null };
                    }

                    if (conditionBlockId === co.conditionBlockId) {
                      return { ...co, orderOfExecution };
                    }
                    return co;
                  }),
                }
              : c
          ),
        })),
      updateConditionBlockType: ({
        conditionBlockId,
        conditionType,
        plotfieldCommandId,
      }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId
                      ? { ...co, conditionType }
                      : co
                  ),
                }
              : c
          ),
        })),
    }),
    { name: "ConditionName", store: "ConditionStore" }
  )
);

export default useConditionBlocks;

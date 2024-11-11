import { create } from "zustand";
import {
  ConditionSignTypes,
  ConditionValueVariationType,
} from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import { devtools } from "zustand/middleware";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { StatusTypes } from "../../../../../../../types/StoryData/Status/StatusTypes";
import { removeElementAtIndex } from "../../../../../../../helpers/removeElementAtIndex";

export type ConditionBlockVariationTypes = {
  conditionBlockVariationId: string;
  type: ConditionValueVariationType;

  commandKeyId?: string;
  appearancePartId?: string;
  characterId?: string;
  characteristicId?: string;
  secondCharacteristicId?: string;

  amountOfRetries?: number;
  currentLanguage?: CurrentlyAvailableLanguagesTypes;
  sign?: ConditionSignTypes;
  value?: number;
  status?: StatusTypes;
  isRandom?: boolean;
};

export type LogicalOperatorTypes = "&&" | "||";

export type ConditionBlockItemTypes = {
  conditionBlockId: string;
  isElse: boolean;
  targetBlockId: string;
  topologyBlockName?: string;
  orderOfExecution: number | null;
  conditionBlockVariations: ConditionBlockVariationTypes[];

  logicalOperators: string;
};

type CommandConditionStoreTypes = {
  conditions: {
    conditionId: string;
    plotfieldCommandId: string;
    currentlyOpenConditionBlockPlotId: string;
    conditionBlocks: ConditionBlockItemTypes[];
  }[];
  setConditionId: ({ conditionId, plotfieldCommandId }: { plotfieldCommandId: string; conditionId: string }) => void;
  setConditionBlocks: ({
    conditionBlocks,
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
    conditionBlocks: ConditionBlockItemTypes[];
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

  setConditionBlockVariations: ({
    conditionBlockVariations,
    conditionBlockId,
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
    conditionBlockId: string;
    conditionBlockVariations: ConditionBlockVariationTypes[];
  }) => void;
  addConditionBlockVariation: ({
    conditionBlockVariation,
    plotfieldCommandId,
    conditionBlockId,
  }: {
    conditionBlockId: string;
    plotfieldCommandId: string;
    conditionBlockVariation: ConditionBlockVariationTypes;
  }) => void;

  updateConditionBlockVariationValue: ({
    conditionBlockId,
    conditionValue,
    conditionBlockVariationId,
    plotfieldCommandId,
  }: {
    conditionBlockId: string;
    conditionBlockVariationId: string;
    plotfieldCommandId: string;

    conditionValue?: number;
    commandKeyId?: string;
    appearancePartId?: string;
    characterId?: string;
    characteristicId?: string;
    secondCharacteristicId?: string;

    amountOfRetries?: number;
    currentLanguage?: CurrentlyAvailableLanguagesTypes;
    sign?: ConditionSignTypes;
    status?: StatusTypes;
  }) => void;
  updateConditionBlockVariationSign: ({
    conditionBlockId,
    conditionBlockVariationId,
    plotFieldCommandId,
    sign,
  }: {
    conditionBlockId: string;
    conditionBlockVariationId: string;
    plotFieldCommandId: string;
    sign: ConditionSignTypes;
  }) => void;
  removeConditionBlockVariation: ({
    conditionBlockVariationId,
    conditionBlockId,
    plotfieldCommandId,
  }: {
    conditionBlockVariationId: string;
    conditionBlockId: string;
    plotfieldCommandId: string;
  }) => void;

  updateLogicalOperator: ({
    plotfieldCommandId,
    conditionBlockId,
    logicalOperator,
    index,
  }: {
    logicalOperator: LogicalOperatorTypes;
    conditionBlockId: string;
    plotfieldCommandId: string;
    index: number;
  }) => void;
  removeLogicalOperator: ({
    conditionBlockId,
    index,
    plotfieldCommandId,
  }: {
    conditionBlockId: string;
    index: number;
    plotfieldCommandId: string;
  }) => void;
  addNewLogicalOperator: ({
    plotfieldCommandId,
    conditionBlockId,
    logicalOperator,
  }: {
    logicalOperator: LogicalOperatorTypes;
    conditionBlockId: string;
    plotfieldCommandId: string;
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
  getAllUsedOrders: ({ plotfieldCommandId }: { plotfieldCommandId: string }) => number[];
  getAllConditionBlocksElseOrIfByPlotfieldCommandId: ({
    plotfieldCommandId,
    isElse,
  }: {
    plotfieldCommandId: string;
    isElse: boolean;
  }) => ConditionBlockItemTypes | ConditionBlockItemTypes[] | null;
  getAmountOfConditionBlocks: ({ plotfieldCommandId }: { plotfieldCommandId: string }) => number;
  getAmountOfOnlyIfConditionBlocks: ({ plotfieldCommandId }: { plotfieldCommandId: string }) => number;
  getCurrentlyOpenConditionBlockPlotId: ({ plotfieldCommandId }: { plotfieldCommandId: string }) => string;
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
  getConditionBlockVariationById: ({
    conditionBlockId,
    plotfieldCommandId,
    conditionBlockVariationId,
  }: {
    conditionBlockId: string;
    plotfieldCommandId: string;
    conditionBlockVariationId: string;
  }) => ConditionBlockVariationTypes | null;
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
  removeConditionBlock: ({
    plotfieldCommandId,
    conditionBlockId,
  }: {
    plotfieldCommandId: string;
    conditionBlockId: string;
  }) => void;
};

const useConditionBlocks = create<CommandConditionStoreTypes>()(
  devtools(
    (set, get) => ({
      conditions: [],
      getAmountOfConditionBlocks: ({ plotfieldCommandId }) => {
        const currentCondition = get().conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId);
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
      getIndexOfConditionBlockById: ({ plotfieldCommandId, conditionBlockId }) => {
        const currentConditionBlocIndex = get()
          .conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.conditionBlocks.findIndex((co) => co.conditionBlockId === conditionBlockId);

        if (typeof currentConditionBlocIndex === "number") {
          return currentConditionBlocIndex;
        } else {
          return null;
        }
      },
      getConditionBlockByIndex: ({ plotfieldCommandId, index }) => {
        const currentConditionBlocIndex = get().conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.conditionBlocks[index];

        if (currentConditionBlocIndex) {
          return currentConditionBlocIndex;
        } else {
          return null;
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
      getFirstConditionBlockWithTopologyBlockId: ({ plotfieldCommandId, insideElse }) => {
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
      getAllConditionBlocksElseOrIfByPlotfieldCommandId: ({ plotfieldCommandId, isElse }) => {
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
              get().conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
                ?.currentlyOpenConditionBlockPlotId
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
          ?.conditionBlocks.find((c) => c.conditionBlockId === conditionBlockId);
        if (conditionBlock) {
          return conditionBlock;
        } else {
          return null;
        }
      },
      getConditionBlockVariationById: ({ plotfieldCommandId, conditionBlockId, conditionBlockVariationId }) => {
        const conditionBlock = get()
          .conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.conditionBlocks.find((c) => c.conditionBlockId === conditionBlockId)
          ?.conditionBlockVariations.find((cbv) => cbv.conditionBlockVariationId === conditionBlockVariationId);
        if (conditionBlock) {
          return conditionBlock;
        } else {
          return null;
        }
      },
      setConditionBlockVariations: ({ conditionBlockId, conditionBlockVariations, plotfieldCommandId }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId
                      ? {
                          ...co,
                          conditionBlockVariations: conditionBlockVariations,
                        }
                      : co
                  ),
                }
              : c
          ),
        })),
      updateConditionBlockVariationValue: ({
        conditionBlockId,
        conditionBlockVariationId,
        conditionValue,
        plotfieldCommandId,
        amountOfRetries,
        appearancePartId,
        characterId,
        characteristicId,
        commandKeyId,
        currentLanguage,
        secondCharacteristicId,
        sign,
        status,
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
                          conditionBlockVariations: co.conditionBlockVariations.map((cov) =>
                            cov.conditionBlockVariationId === conditionBlockVariationId
                              ? {
                                  ...cov,
                                  value: conditionValue,
                                  amountOfRetries,
                                  appearancePartId,
                                  characterId,
                                  characteristicId,
                                  commandKeyId,
                                  conditionBlockVariationId,
                                  currentLanguage,
                                  secondCharacteristicId,
                                  sign,
                                  status,
                                }
                              : cov
                          ),
                        }
                      : co
                  ),
                }
              : c
          ),
        })),
      updateLogicalOperator: ({ conditionBlockId, index, logicalOperator, plotfieldCommandId }) => {
        const currentLogicalOperators = get()
          .conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.conditionBlocks.find((co) => co.conditionBlockId === conditionBlockId)?.logicalOperators;

        if (currentLogicalOperators?.trim()?.length) {
          const splittedLogicalOperators = currentLogicalOperators?.split(",");

          if (typeof index === "number" && index >= 0 && index <= (splittedLogicalOperators?.length || 0) - 1) {
            splittedLogicalOperators[index] = logicalOperator;
            const newLogicalOperators = splittedLogicalOperators.join(",");

            set((state: CommandConditionStoreTypes) => {
              const updatedConditions = state.conditions.map((c) => {
                if (c.plotfieldCommandId === plotfieldCommandId) {
                  return {
                    ...c,
                    conditionBlocks: c.conditionBlocks.map((cb) => {
                      if (cb.conditionBlockId === conditionBlockId) {
                        return {
                          ...cb,
                          logicalOperators: newLogicalOperators,
                        };
                      }
                      return cb;
                    }),
                  };
                }
                return c;
              });

              return { conditions: updatedConditions };
            });
          }
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
      updateConditionBlockTargetBlockId: ({ plotfieldCommandId, conditionBlockId, targetBlockId, topologyBlockName }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId ? { ...co, targetBlockId, topologyBlockName } : co
                  ),
                }
              : c
          ),
        })),
      updateCurrentlyOpenConditionBlock: ({ plotfieldCommandId, conditionBlockId }) =>
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

      updateConditionBlockVariationSign: ({ conditionBlockId, sign, conditionBlockVariationId, plotFieldCommandId }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotFieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId
                      ? {
                          ...co,
                          conditionBlockVariations: co.conditionBlockVariations.map((cov) =>
                            cov.conditionBlockVariationId === conditionBlockVariationId
                              ? {
                                  ...cov,
                                  sign,
                                }
                              : cov
                          ),
                        }
                      : co
                  ),
                }
              : c
          ),
        })),
      addConditionBlockVariation: ({ conditionBlockId, conditionBlockVariation, plotfieldCommandId }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId
                      ? {
                          ...co,
                          conditionBlockVariations: co.conditionBlockVariations.find(
                            (cov) => cov.conditionBlockVariationId === conditionBlockVariation.conditionBlockVariationId
                          )
                            ? co.conditionBlockVariations
                            : [...co.conditionBlockVariations, conditionBlockVariation],
                        }
                      : co
                  ),
                }
              : c
          ),
        })),
      addNewLogicalOperator: ({ conditionBlockId, logicalOperator, plotfieldCommandId }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId
                      ? {
                          ...co,
                          logicalOperators:
                            co.logicalOperators?.trim()?.length > 0
                              ? `${co.logicalOperators},${logicalOperator}`
                              : logicalOperator,
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
                    (co) => co.conditionBlockId === conditionBlock.conditionBlockId
                  )
                    ? c.conditionBlocks
                    : [...c.conditionBlocks, conditionBlock],
                }
              : c
          ),
        })),
      setConditionBlocks: ({ conditionBlocks, plotfieldCommandId }) =>
        set((state) => {
          const existingCondition = state.conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId);
          if (existingCondition) {
            return {
              conditions: state.conditions.map((c) =>
                c.plotfieldCommandId === plotfieldCommandId
                  ? {
                      ...c,
                      conditionBlocks: conditionBlocks.map((co) => ({
                        conditionBlockId: co.conditionBlockId,
                        orderOfExecution: co.orderOfExecution || null,
                        targetBlockId: co.targetBlockId || "",
                        topologyBlockName: "",
                        isElse: co.isElse || false,
                        conditionBlockVariations: co.conditionBlockVariations || [],
                        logicalOperators: co.logicalOperators || "",
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
                    conditionBlockId: co.conditionBlockId,
                    orderOfExecution: co.orderOfExecution || null,
                    targetBlockId: co.targetBlockId,
                    topologyBlockName: "",
                    isElse: co.isElse || false,
                    conditionBlockVariations: co.conditionBlockVariations || [],
                    logicalOperators: co.logicalOperators || "",
                  })),
                  currentlyOpenConditionBlockPlotId: "",
                },
              ],
            };
          }
        }),
      updateConditionOrderOfExecution: ({ conditionBlockId, orderOfExecution, plotfieldCommandId }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) => {
                    if (co.orderOfExecution === orderOfExecution && conditionBlockId !== co.conditionBlockId) {
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

      removeConditionBlock: ({ conditionBlockId, plotfieldCommandId }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.filter((co) => co.conditionBlockId !== conditionBlockId),
                }
              : c
          ),
        })),
      removeLogicalOperator: ({ conditionBlockId, index, plotfieldCommandId }) => {
        const existingLogicalOperators = get()
          .conditions.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.conditionBlocks.find((co) => co.conditionBlockId === conditionBlockId)?.logicalOperators;

        if (existingLogicalOperators?.trim()?.length) {
          const splittedLogicalOperators = existingLogicalOperators?.split(",");

          if (typeof index === "number" && index >= 0 && index <= (splittedLogicalOperators.length || 0) - 1) {
            const newLogicalOperatorsArray = removeElementAtIndex({ array: splittedLogicalOperators, index });

            const newLogicalOperators = newLogicalOperatorsArray.join(",");

            set((state) => ({
              conditions: state.conditions.map((c) =>
                c.plotfieldCommandId === plotfieldCommandId
                  ? {
                      ...c,
                      conditionBlocks: c.conditionBlocks.map((co) =>
                        co.conditionBlockId === conditionBlockId ? { ...co, logicalOperators: newLogicalOperators } : co
                      ),
                    }
                  : c
              ),
            }));
          }
        }
      },
      removeConditionBlockVariation: ({ conditionBlockId, conditionBlockVariationId, plotfieldCommandId }) =>
        set((state) => ({
          conditions: state.conditions.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  conditionBlocks: c.conditionBlocks.map((co) =>
                    co.conditionBlockId === conditionBlockId
                      ? {
                          ...co,
                          conditionBlockVariations: co.conditionBlockVariations.filter(
                            (cov) => cov.conditionBlockVariationId !== conditionBlockVariationId
                          ),
                        }
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

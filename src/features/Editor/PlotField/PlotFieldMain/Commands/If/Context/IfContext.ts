import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { StatusTypes } from "../../../../../../../types/StoryData/Status/StatusTypes";
import {
  ConditionSignTypes,
  ConditionValueVariationType,
} from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import { removeElementAtIndex } from "../../../../../../../helpers/removeElementAtIndex";

export type IfVariationTypes = {
  ifVariationId: string;
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
  currentlyDressed?: boolean;

  createdAt: string;
  updatedAt: string;
};

export type LogicalOperatorTypes = "&&" | "||";

export type AllIfValueVariationByLogicalOperatorIndexTypes = {
  type: ConditionValueVariationType;
  ifVariationId: string;
};

type CommandIfStoreTypes = {
  ifs: {
    plotfieldCommandId: string;
    ifVariations: IfVariationTypes[];
    logicalOperators: string;
  }[];
  setCommandIf: ({
    ifVariations,
    logicalOperators,
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
    logicalOperators: string;
    ifVariations: [];
  }) => void;

  getAllLogicalOperators: ({ plotfieldCommandId }: { plotfieldCommandId: string }) => string;

  setIfVariations: ({
    ifVariations,
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
    ifVariations: IfVariationTypes[];
  }) => void;

  addIfVariation: ({
    ifVariation,
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
    ifVariation: IfVariationTypes;
  }) => void;

  updateIfVariationValue: ({
    ifValue,
    ifVariationId,
    plotfieldCommandId,
  }: {
    ifVariationId: string;
    plotfieldCommandId: string;

    ifValue?: number;
    commandKeyId?: string;
    appearancePartId?: string;
    characterId?: string;
    characteristicId?: string;
    secondCharacteristicId?: string;

    amountOfRetries?: number;
    currentlyDressed?: boolean;
    currentLanguage?: CurrentlyAvailableLanguagesTypes;
    sign?: ConditionSignTypes;
    status?: StatusTypes;
  }) => void;
  updateIfVariationSign: ({
    ifVariationId,
    plotFieldCommandId,
    sign,
  }: {
    ifVariationId: string;
    plotFieldCommandId: string;
    sign: ConditionSignTypes;
  }) => void;

  removeIfVariation: ({
    ifVariationId,
    plotfieldCommandId,
    index,
  }: {
    ifVariationId: string;
    plotfieldCommandId: string;
    index?: number;
  }) => void;

  updateLogicalOperator: ({
    plotfieldCommandId,
    logicalOperator,
    index,
  }: {
    logicalOperator: LogicalOperatorTypes;
    plotfieldCommandId: string;
    index: number;
  }) => void;

  removeLogicalOperator: ({ index, plotfieldCommandId }: { index: number; plotfieldCommandId: string }) => void;

  addNewLogicalOperator: ({
    plotfieldCommandId,
    logicalOperator,
  }: {
    logicalOperator: LogicalOperatorTypes;
    plotfieldCommandId: string;
  }) => void;

  getAllIfValueVariationByLogicalOperatorIndex: ({
    index,
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
    index: number;
  }) => AllIfValueVariationByLogicalOperatorIndexTypes[];

  getAmountOfIfVariations: ({ plotfieldCommandId }: { plotfieldCommandId: string }) => number;

  getAllIfVariationsByPlotfieldCommandId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => IfVariationTypes[];

  getIfVariationById: ({
    ifVariationId,
    plotfieldCommandId,
  }: {
    ifVariationId: string;
    plotfieldCommandId: string;
  }) => IfVariationTypes | null;

  getIndexOfIfVariationById: ({
    plotfieldCommandId,
    ifVariationId,
  }: {
    plotfieldCommandId: string;
    ifVariationId: string;
  }) => number | null;
  getIfVariationByIndex: ({
    plotfieldCommandId,
    index,
  }: {
    plotfieldCommandId: string;
    index: number;
  }) => IfVariationTypes | null;
};

const useIfVariations = create<CommandIfStoreTypes>()(
  devtools(
    (set, get) => ({
      ifs: [],
      getAmountOfIfVariations: ({ plotfieldCommandId }) => {
        const currentIf = get().ifs.find((c) => c.plotfieldCommandId === plotfieldCommandId);
        if (currentIf) {
          return currentIf.ifVariations.length;
        } else {
          return 0;
        }
      },
      getAllLogicalOperators: ({ plotfieldCommandId }) => {
        const currentIf = get().ifs.find((c) => c.plotfieldCommandId === plotfieldCommandId);
        if (currentIf?.logicalOperators) {
          return currentIf.logicalOperators;
        } else {
          return "";
        }
      },
      setCommandIf: ({ ifVariations, logicalOperators, plotfieldCommandId }) => {
        const existingIf = get().ifs.find((f) => f.plotfieldCommandId === plotfieldCommandId);
        if (!existingIf) {
          return set((state) => ({
            ifs: [
              ...state.ifs,
              {
                ifVariations,
                logicalOperators,
                plotfieldCommandId,
              },
            ],
          }));
        }
      },
      setIfVariations: ({ ifVariations, plotfieldCommandId }) =>
        set((state) => ({
          ifs: state.ifs.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  ifVariations: ifVariations,
                }
              : c
          ),
        })),
      getAllIfValueVariationByLogicalOperatorIndex: ({ plotfieldCommandId, index }) => {
        const allIfVariationIds = [] as AllIfValueVariationByLogicalOperatorIndexTypes[];
        const currentIfVariations = get().ifs.find((c) => c.plotfieldCommandId === plotfieldCommandId)?.ifVariations;

        currentIfVariations?.map((cbv, i) => {
          if (i > index) {
            allIfVariationIds.push({
              ifVariationId: cbv.ifVariationId,
              type: cbv.type,
            });
          }
        });
        return allIfVariationIds;
      },
      getIndexOfIfVariationById: ({ plotfieldCommandId, ifVariationId }) => {
        const currentIfIndex = get()
          .ifs.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.ifVariations.findIndex((co) => co.ifVariationId === ifVariationId);

        if (typeof currentIfIndex === "number") {
          return currentIfIndex;
        } else {
          return null;
        }
      },
      getIfVariationByIndex: ({ plotfieldCommandId, index }) => {
        const currentIfIndex = get().ifs.find((c) => c.plotfieldCommandId === plotfieldCommandId)?.ifVariations[index];

        if (currentIfIndex) {
          return currentIfIndex;
        } else {
          return null;
        }
      },

      getAllIfVariationsByPlotfieldCommandId: ({ plotfieldCommandId }) => {
        const ifVariations = get().ifs.find((c) => c.plotfieldCommandId === plotfieldCommandId)?.ifVariations;
        if (ifVariations) {
          return ifVariations;
        } else {
          return [];
        }
      },

      getIfVariationById: ({ plotfieldCommandId, ifVariationId }) => {
        const ifVariation = get()
          .ifs.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.ifVariations.find((c) => c.ifVariationId === ifVariationId);
        if (ifVariation) {
          return ifVariation;
        } else {
          return null;
        }
      },

      updateIfVariationValue: ({
        ifVariationId,
        ifValue,
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
        currentlyDressed,
      }) =>
        set((state) => ({
          ifs: state.ifs.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  ifVariations: c.ifVariations.map((cov) =>
                    cov.ifVariationId === ifVariationId
                      ? {
                          ...cov,
                          value: typeof ifValue === "number" ? ifValue : cov.value,
                          amountOfRetries: typeof amountOfRetries === "number" ? amountOfRetries : cov.amountOfRetries,
                          appearancePartId: appearancePartId?.trim().length ? appearancePartId : cov.appearancePartId,
                          characterId: characterId?.trim().length ? characterId : cov.characterId,
                          characteristicId: characteristicId?.trim().length ? characteristicId : cov.characteristicId,
                          commandKeyId: commandKeyId?.trim().length ? commandKeyId : cov.commandKeyId,
                          ifVariationId: ifVariationId?.trim().length ? ifVariationId : cov.ifVariationId,
                          currentLanguage: currentLanguage?.trim().length ? currentLanguage : cov.currentLanguage,
                          secondCharacteristicId: secondCharacteristicId?.trim().length
                            ? secondCharacteristicId
                            : cov.secondCharacteristicId,
                          sign: sign?.trim().length ? sign : cov.sign,
                          status: status?.trim().length ? status : cov.status,
                          currentlyDressed:
                            typeof currentlyDressed === "boolean" ? currentlyDressed : cov.currentlyDressed,
                        }
                      : cov
                  ),
                }
              : c
          ),
        })),
      updateLogicalOperator: ({ index, logicalOperator, plotfieldCommandId }) => {
        const currentLogicalOperators = get().ifs.find(
          (c) => c.plotfieldCommandId === plotfieldCommandId
        )?.logicalOperators;

        if (currentLogicalOperators?.trim()?.length) {
          const splittedLogicalOperators = currentLogicalOperators?.split(",");

          if (typeof index === "number" && index >= 0 && index <= (splittedLogicalOperators?.length || 0) - 1) {
            splittedLogicalOperators[index] = logicalOperator;
            const newLogicalOperators = splittedLogicalOperators.join(",");

            set((state: CommandIfStoreTypes) => {
              const updatedIfs = state.ifs.map((c) => {
                if (c.plotfieldCommandId === plotfieldCommandId) {
                  return {
                    ...c,
                    logicalOperators: newLogicalOperators,
                  };
                }
                return c;
              });

              return { ifs: updatedIfs };
            });
          }
        }
      },

      updateIfVariationSign: ({ sign, ifVariationId, plotFieldCommandId }) =>
        set((state) => ({
          ifs: state.ifs.map((c) =>
            c.plotfieldCommandId === plotFieldCommandId
              ? {
                  ...c,
                  ifVariations: c.ifVariations.map((cov) =>
                    cov.ifVariationId === ifVariationId
                      ? {
                          ...cov,
                          sign,
                        }
                      : cov
                  ),
                }
              : c
          ),
        })),
      addIfVariation: ({ ifVariation, plotfieldCommandId }) =>
        set((state) => ({
          ifs: state.ifs.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  ifVariations: c.ifVariations.find((cov) => cov.ifVariationId === ifVariation.ifVariationId)
                    ? c.ifVariations
                    : [...c.ifVariations, ifVariation],
                }
              : c
          ),
        })),
      addNewLogicalOperator: ({ logicalOperator, plotfieldCommandId }) =>
        set((state) => ({
          ifs: state.ifs.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  logicalOperators:
                    c.logicalOperators?.trim()?.length > 0
                      ? `${c.logicalOperators},${logicalOperator}`
                      : logicalOperator,
                }
              : c
          ),
        })),

      removeLogicalOperator: ({ index, plotfieldCommandId }) => {
        const existingLogicalOperators = get().ifs.find(
          (c) => c.plotfieldCommandId === plotfieldCommandId
        )?.logicalOperators;

        if (existingLogicalOperators?.trim()?.length) {
          const splittedLogicalOperators = existingLogicalOperators?.split(",");

          if (typeof index === "number" && index >= 0 && index <= (splittedLogicalOperators.length || 0) - 1) {
            const newLogicalOperatorsArray = splittedLogicalOperators.splice(0, index);

            const newLogicalOperators = newLogicalOperatorsArray.join(",");

            set((state) => ({
              ifs: state.ifs.map((c) =>
                c.plotfieldCommandId === plotfieldCommandId
                  ? {
                      ...c,
                      logicalOperators: newLogicalOperators,
                    }
                  : c
              ),
            }));

            set((state) => ({
              ifs: state.ifs.map((c) =>
                c.plotfieldCommandId === plotfieldCommandId
                  ? {
                      ...c,

                      ifVariations: c.ifVariations.filter((_cov, i) => i <= index),
                    }
                  : c
              ),
            }));
          }
        }
      },
      removeIfVariation: ({ ifVariationId, plotfieldCommandId, index }) =>
        set((state) => ({
          ifs: state.ifs.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  logicalOperators:
                    typeof index === "number" && index >= 0 && index < (c.logicalOperators.split(",")?.length || 0)
                      ? removeElementAtIndex({ array: c.logicalOperators.split(",") || [], index }).join(",")
                      : c.logicalOperators,
                  ifVariations: c.ifVariations.filter((cov) => cov.ifVariationId !== ifVariationId),
                }
              : c
          ),
        })),
    }),
    { name: "IfName", store: "IfStore" }
  )
);

export default useIfVariations;

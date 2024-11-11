import { create } from "zustand";
import { ChoiceOptionVariationsTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { TranslationChoiceOptionTypes } from "../../../../../../../types/Additional/TranslationTypes";
import { devtools } from "zustand/middleware";

export type ChoiceOptionItemTypes = {
  choiceOptionId: string;
  topologyBlockId: string;
  topologyBlockName?: string;
  optionText: string;
  optionOrder: number | null;
  optionType: ChoiceOptionVariationsTypes;
};

type CommandChoiceStoreTypes = {
  choices: {
    choiceId: string;
    plotfieldCommandId: string;
    currentlyOpenChoiceOptionPlotId: string;
    choiceOptions: ChoiceOptionItemTypes[];
  }[];
  setChoiceOptions: ({
    choiceOptions,
    choiceId,
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
    choiceId: string;
    choiceOptions: TranslationChoiceOptionTypes[];
  }) => void;
  addChoiceOption: ({ choiceOption, choiceId }: { choiceId: string; choiceOption: ChoiceOptionItemTypes }) => void;
  updateChoiceOptionTopologyBlockId: ({
    choiceOptionId,
    topologyBlockId,
    choiceId,
    topologyBlockName,
  }: {
    topologyBlockName: string;
    choiceOptionId: string;
    choiceId: string;
    topologyBlockId: string;
  }) => void;
  updateChoiceOptionType: ({
    id,
    optionType,
    choiceId,
  }: {
    id: string;
    choiceId: string;
    optionType: ChoiceOptionVariationsTypes;
  }) => void;
  updateChoiceOptionText: ({ id, optionText, choiceId }: { choiceId: string; id: string; optionText: string }) => void;
  updateChoiceOptionOrder: ({
    choiceOptionId,
    optionOrder,
    choiceId,
  }: {
    choiceId: string;
    choiceOptionId: string;
    optionOrder: number;
  }) => void;
  updateCurrentlyOpenChoiceOption: ({
    plotfieldCommandId,
    choiceOptionId,
  }: {
    plotfieldCommandId: string;
    choiceOptionId: string;
  }) => void;
  getAmountOfChoiceOptions: ({ choiceId }: { choiceId: string }) => number;
  getCurrentlyOpenChoiceOptionPlotId: ({ choiceId }: { choiceId: string }) => string;
  getAllChoiceOptionsByChoiceId: ({ choiceId }: { choiceId: string }) => ChoiceOptionItemTypes[];
  getFirstChoiceOptionWithTopologyBlockId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ChoiceOptionItemTypes | null;
  getIndexOfChoiceOptionById: ({
    plotfieldCommandId,
    choiceOptionId,
  }: {
    plotfieldCommandId: string;
    choiceOptionId: string;
  }) => number | null;
  getChoiceOptionByIndex: ({
    plotfieldCommandId,
    index,
  }: {
    plotfieldCommandId: string;
    index: number;
  }) => ChoiceOptionItemTypes | null;
  getChoiceOptionById: ({
    choiceOptionId,
    choiceId,
  }: {
    choiceOptionId: string;
    choiceId: string;
  }) => ChoiceOptionItemTypes | null;
  getChoiceOptionText: ({ choiceId, choiceOptionId }: { choiceId: string; choiceOptionId: string }) => string;
  getCurrentlyOpenChoiceOption: ({ choiceId }: { choiceId: string }) => ChoiceOptionItemTypes | null;
  removeChoiceOption: ({
    plotfieldCommandId,
    choiceOptionId,
  }: {
    plotfieldCommandId: string;
    choiceOptionId: string;
  }) => void;
};

const useChoiceOptions = create<CommandChoiceStoreTypes>()(
  devtools(
    (set, get) => ({
      choices: [],
      getAmountOfChoiceOptions: ({ choiceId }) => {
        const currentChoice = get().choices.find((c) => c.choiceId === choiceId);
        if (currentChoice) {
          return currentChoice.choiceOptions.length;
        } else {
          return 0;
        }
      },
      getChoiceOptionText: ({ choiceId, choiceOptionId }) => {
        const currentChoiceOptionText = get()
          .choices.find((c) => c.choiceId === choiceId)
          ?.choiceOptions.find((co) => co.choiceOptionId === choiceOptionId)?.optionText;

        if (currentChoiceOptionText) {
          return currentChoiceOptionText;
        } else {
          return "";
        }
      },
      getCurrentlyOpenChoiceOptionPlotId: ({ choiceId }) => {
        const currentlyOpenChoiceOptionPlotId = get().choices.find(
          (c) => c.choiceId === choiceId
        )?.currentlyOpenChoiceOptionPlotId;
        if (currentlyOpenChoiceOptionPlotId) {
          return currentlyOpenChoiceOptionPlotId;
        } else {
          return "";
        }
      },
      getFirstChoiceOptionWithTopologyBlockId: ({ plotfieldCommandId }) => {
        const choiceOption = get()
          .choices.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.choiceOptions.find((c) => c.topologyBlockId);
        if (choiceOption) {
          return choiceOption;
        } else {
          return null;
        }
      },
      getIndexOfChoiceOptionById: ({ plotfieldCommandId, choiceOptionId }) => {
        const currentConditionBlocIndex = get()
          .choices.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.choiceOptions.findIndex((co) => co.choiceOptionId === choiceOptionId);

        if (typeof currentConditionBlocIndex === "number") {
          return currentConditionBlocIndex;
        } else {
          return null;
        }
      },
      getChoiceOptionByIndex: ({ plotfieldCommandId, index }) => {
        const currentConditionBlocIndex = get().choices.find((c) => c.plotfieldCommandId === plotfieldCommandId)
          ?.choiceOptions[index];

        if (currentConditionBlocIndex) {
          return currentConditionBlocIndex;
        } else {
          return null;
        }
      },
      getAllChoiceOptionsByChoiceId: ({ choiceId }) => {
        const choiceOptions = get().choices.find((c) => c.choiceId === choiceId)?.choiceOptions;
        if (choiceOptions) {
          return choiceOptions;
        } else {
          return [];
        }
      },
      getCurrentlyOpenChoiceOption: ({ choiceId }) => {
        const choiceOption = get()
          .choices.find((c) => c.choiceId === choiceId)
          ?.choiceOptions.find(
            (c) =>
              c.choiceOptionId === get().choices.find((c) => c.choiceId === choiceId)?.currentlyOpenChoiceOptionPlotId
          );
        if (choiceOption) {
          return choiceOption;
        } else {
          return null;
        }
      },
      getChoiceOptionById: ({ choiceId, choiceOptionId }) => {
        const choiceOption = get()
          .choices.find((c) => c.choiceId === choiceId)
          ?.choiceOptions.find((c) => c.choiceOptionId === choiceOptionId);
        if (choiceOption) {
          return choiceOption;
        } else {
          return null;
        }
      },
      updateChoiceOptionTopologyBlockId: ({ choiceId, choiceOptionId, topologyBlockId, topologyBlockName }) =>
        set((state) => ({
          choices: state.choices.map((c) =>
            c.choiceId === choiceId
              ? {
                  ...c,
                  choiceOptions: c.choiceOptions.map((co) =>
                    co.choiceOptionId === choiceOptionId ? { ...co, topologyBlockId, topologyBlockName } : co
                  ),
                }
              : c
          ),
        })),
      updateCurrentlyOpenChoiceOption: ({ plotfieldCommandId, choiceOptionId }) =>
        set((state) => ({
          choices: state.choices.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  currentlyOpenChoiceOptionPlotId: choiceOptionId,
                  choiceOptions: c.choiceOptions.map((co) => (co.choiceOptionId === choiceOptionId ? { ...co } : co)),
                }
              : c
          ),
        })),
      updateChoiceOptionText: ({ id, optionText, choiceId }) =>
        set((state) => ({
          choices: state.choices.map((c) =>
            c.choiceId === choiceId
              ? {
                  ...c,
                  choiceOptions: c.choiceOptions.map((co) => (co.choiceOptionId === id ? { ...co, optionText } : co)),
                }
              : c
          ),
        })),
      addChoiceOption: ({ choiceOption, choiceId }) =>
        set((state) => ({
          choices: state.choices.map((c) =>
            c.choiceId === choiceId
              ? {
                  ...c,
                  choiceOptions: c.choiceOptions.find((co) => co.choiceOptionId === choiceOption.choiceOptionId)
                    ? c.choiceOptions
                    : [...c.choiceOptions, choiceOption],
                }
              : c
          ),
        })),
      setChoiceOptions: ({ choiceOptions, choiceId, plotfieldCommandId }) =>
        set((state) => {
          const existingChoice = state.choices.find((c) => c.choiceId === choiceId);
          if (existingChoice) {
            return {
              choices: state.choices.map((c) =>
                c.choiceId === choiceId
                  ? {
                      ...c,
                      choiceOptions: choiceOptions.map((co) => ({
                        choiceOptionId: co.choiceOptionId,
                        optionOrder: null,
                        optionText: co.translations[0]?.text || "",
                        optionType: co.type,
                        topologyBlockId: "",
                        topologyBlockName: "",
                      })),
                    }
                  : c
              ),
            };
          } else {
            return {
              choices: [
                ...state.choices,
                {
                  choiceId,
                  plotfieldCommandId,
                  choiceOptions: choiceOptions.map((co) => ({
                    choiceOptionId: co.choiceOptionId,
                    optionOrder: null,
                    optionText: co.translations[0]?.text || "",
                    optionType: co.type,
                    topologyBlockId: "",
                  })),
                  currentlyOpenChoiceOptionPlotId: "",
                },
              ],
            };
          }
        }),
      updateChoiceOptionOrder: ({ choiceOptionId, optionOrder, choiceId }) =>
        set((state) => ({
          choices: state.choices.map((c) =>
            c.choiceId === choiceId
              ? {
                  ...c,
                  choiceOptions: c.choiceOptions.map((co) => {
                    if (co.optionOrder === optionOrder && choiceOptionId !== co.choiceOptionId) {
                      return { ...co, optionOrder: null };
                    }

                    if (choiceOptionId === co.choiceOptionId) {
                      return { ...co, optionOrder };
                    }
                    return co;
                  }),
                }
              : c
          ),
        })),
      updateChoiceOptionType: ({ id, optionType, choiceId }) =>
        set((state) => ({
          choices: state.choices.map((c) =>
            c.choiceId === choiceId
              ? {
                  ...c,
                  choiceOptions: c.choiceOptions.map((co) => (co.choiceOptionId === id ? { ...co, optionType } : co)),
                }
              : c
          ),
        })),
      removeChoiceOption: ({ choiceOptionId, plotfieldCommandId }) =>
        set((state) => ({
          choices: state.choices.map((c) =>
            c.plotfieldCommandId === plotfieldCommandId
              ? {
                  ...c,
                  choiceOptions: c.choiceOptions.filter((co) => co.choiceOptionId !== choiceOptionId),
                }
              : c
          ),
        })),
    }),
    { name: "ChoiceName", store: "ChoiceStore" }
  )
);

export default useChoiceOptions;

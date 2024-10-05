import { create } from "zustand";
import { ChoiceOptionVariationsTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";

type ChoiceOptionItemTypes = {
  choiceOptionId: string;
  topologyBlockId: string;
  optionText: string;
  optionType: ChoiceOptionVariationsTypes;
};

type CommandChoiceStoreTypes = {
  choiceId: string;
  currentlyOpenChoiceOptionPlotId: string;
  choiceOptions: ChoiceOptionItemTypes[];
  setChoiceOptions: ({
    choiceOptions,
  }: {
    choiceOptions: ChoiceOptionItemTypes[];
  }) => void;
  setChoiceId: ({ choiceId }: { choiceId: string }) => void;
  addChoiceOption: ({
    choiceOption,
  }: {
    choiceOption: ChoiceOptionItemTypes;
  }) => void;
  updateChoiceOptionType: ({
    id,
    optionType,
  }: {
    id: string;
    optionType: ChoiceOptionVariationsTypes;
  }) => void;
  updateChoiceOptionText: ({
    id,
    optionText,
  }: {
    id: string;
    optionText: string;
  }) => void;
  updateCurrentlyOpenChoiceOption: ({
    choiceOptionId,
    topologyBlockId,
  }: {
    choiceOptionId: string;
    topologyBlockId: string;
  }) => void;
  getChoiceOptionById: ({
    choiceOptionId,
  }: {
    choiceOptionId: string;
  }) => ChoiceOptionItemTypes | null;
  getCurrentlyOpenChoiceOption: () => ChoiceOptionItemTypes | null;
};

const useChoiceOptions = create<CommandChoiceStoreTypes>()((set, get) => ({
  choiceId: "",
  choiceOptions: [],
  currentlyOpenChoiceOptionPlotId: "",
  getCurrentlyOpenChoiceOption: () => {
    const choiceOption = get().choiceOptions.find(
      (c) => c.choiceOptionId === get().currentlyOpenChoiceOptionPlotId
    );
    if (choiceOption) {
      return choiceOption;
    } else {
      return null;
    }
  },
  getChoiceOptionById: ({ choiceOptionId }) => {
    const choiceOption = get().choiceOptions.find(
      (c) => c.choiceOptionId === choiceOptionId
    );
    if (choiceOption) {
      return choiceOption;
    } else {
      return null;
    }
  },
  updateCurrentlyOpenChoiceOption: ({ choiceOptionId, topologyBlockId }) =>
    set((state) => ({
      currentlyOpenChoiceOptionPlotId: choiceOptionId,
      choiceOptions: state.choiceOptions.map((co) =>
        co.choiceOptionId === choiceOptionId ? { ...co, topologyBlockId } : co
      ),
    })),
  updateChoiceOptionText: ({ id, optionText }) =>
    set((state) => ({
      choiceOptions: state.choiceOptions.map((co) =>
        co.choiceOptionId === id ? { ...co, optionText } : co
      ),
    })),
  addChoiceOption: ({ choiceOption }) =>
    set((state) => ({
      choiceOptions: state.choiceOptions.find(
        (c) => c.choiceOptionId === choiceOption.choiceOptionId
      )
        ? state.choiceOptions
        : [...state.choiceOptions, choiceOption],
    })),
  setChoiceOptions: ({ choiceOptions }) =>
    set(() => ({
      choiceOptions,
    })),
  setChoiceId: ({ choiceId }) =>
    set(() => ({
      choiceId,
    })),
  updateChoiceOptionType: ({ id, optionType }) =>
    set((state) => ({
      choiceOptions: state.choiceOptions.map((co) =>
        co.choiceOptionId === id ? { ...co, optionType } : co
      ),
    })),
}));

export default useChoiceOptions;

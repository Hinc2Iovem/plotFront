import { StateCreator } from "zustand";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";

export type PlotfieldOptimisticCommandTypes = {
  _id: string;
  command: AllPossiblePlotFieldComamndsTypes;
  commandOrder: number;
  topologyBlockId: string;
  sayType?: CommandSayVariationTypes;
  characterId?: string;
  characterName?: string;
  commandIfId?: string;
  isElse?: boolean;
};

type UpdateCommandNameTypes = {
  id: string;
  newCommand: AllPossiblePlotFieldComamndsTypes;
  sayType?: CommandSayVariationTypes;
  characterId?: string;
  characterName?: string;
};

export type CreatePlotfieldCommandSliceTypes = {
  commands: {
    topologyBlockId: string;
    commands: PlotfieldOptimisticCommandTypes[];
  }[];
  getCommandsByTopologyBlockId: ({
    topologyBlockId,
  }: {
    topologyBlockId: string;
  }) => PlotfieldOptimisticCommandTypes[];
  addCommand: ({
    newCommand,
    topologyBlockId,
  }: {
    newCommand: PlotfieldOptimisticCommandTypes;
    topologyBlockId: string;
  }) => void;
  updateCommandName: ({
    id,
    newCommand,
    sayType,
    characterId,
    characterName,
  }: UpdateCommandNameTypes) => void;
  removeCommandItem: ({ id }: { id: string }) => void;
  updateCommandOrder: ({
    commandOrder,
    id,
  }: {
    id: string;
    commandOrder: number;
  }) => void;
  setAllCommands: ({
    commands,
    topologyBlockId,
  }: {
    commands: PlotfieldOptimisticCommandTypes[];
    topologyBlockId: string;
  }) => void;
  clearCommand: () => void;
};

export const createPlotfieldCommandSlice: StateCreator<
  CreatePlotfieldCommandSliceTypes,
  [],
  [],
  CreatePlotfieldCommandSliceTypes
> = (set, get) => ({
  commands: [
    {
      topologyBlockId: "",
      commands: [],
    },
  ],
  getCommandsByTopologyBlockId: ({ topologyBlockId }) => {
    const allCommands =
      get().commands.find((c) => c.topologyBlockId === topologyBlockId)
        ?.commands || [];
    return allCommands;
  },
  addCommand: ({ newCommand, topologyBlockId }) =>
    set((state) => {
      const existingBlock = state.commands.find(
        (block) => block.topologyBlockId === topologyBlockId
      );

      if (existingBlock) {
        return {
          commands: state.commands.map((block) =>
            block.topologyBlockId === topologyBlockId
              ? {
                  ...block,
                  commands: [...block.commands, newCommand],
                }
              : block
          ),
        };
      } else {
        return {
          commands: [
            ...state.commands,
            { topologyBlockId, commands: [newCommand] },
          ],
        };
      }
    }),
  updateCommandName: ({
    id,
    newCommand,
    sayType,
    characterId,
    characterName,
  }: {
    id: string;
    newCommand: AllPossiblePlotFieldComamndsTypes;
    sayType?: CommandSayVariationTypes;
    characterId?: string;
    characterName?: string;
  }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) =>
          command._id === id
            ? {
                ...command,
                command: newCommand,
                sayType,
                characterId,
                characterName,
              }
            : command
        ),
      })),
    })),
  updateCommandOrder: ({ id, commandOrder }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) =>
          command._id === id ? { ...command, commandOrder } : command
        ),
      })),
    })),
  setAllCommands: ({ commands, topologyBlockId }) =>
    set((state) => {
      const existingBlock = state.commands.find(
        (block) => block.topologyBlockId === topologyBlockId
      );

      if (existingBlock) {
        return {
          commands: state.commands.map((block) =>
            block.topologyBlockId === topologyBlockId
              ? { ...block, commands }
              : block
          ),
        };
      } else {
        return {
          commands: [...state.commands, { topologyBlockId, commands }],
        };
      }
    }),
  removeCommandItem: ({ id }) =>
    set((state) => ({
      commands: state.commands.map((c) => ({
        ...c,
        commands: c.commands.filter((ce) => ce._id !== id),
      })),
    })),
  clearCommand: () =>
    set(() => ({
      commands: [],
    })),
});

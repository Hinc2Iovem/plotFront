import { StateCreator } from "zustand";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";

export type PlotfieldOptimisticCommandTypes = {
  _id: string;
  command: AllPossiblePlotFieldComamndsTypes;
  commandOrder: number;
  commandSide?: "right" | "left";

  topologyBlockId: string;

  sayType?: CommandSayVariationTypes;

  characterId?: string;
  characterName?: string;
  characterImg?: string;

  emotionName?: string;
  emotionId?: string;
  emotionImg?: string;

  commandIfId?: string;
  isElse?: boolean;
};

type UpdateCommandNameTypes = {
  id: string;
  newCommand: AllPossiblePlotFieldComamndsTypes;
  sayType?: CommandSayVariationTypes;
  characterId?: string;
  characterName?: string;
  characterImg?: string;
};

export type CreatePlotfieldCommandSliceTypes = {
  focuseReset: boolean;
  commands: {
    topologyBlockId: string;
    commands: PlotfieldOptimisticCommandTypes[];
  }[];
  getCommandByPlotfieldCommandId: ({
    plotfieldCommandId,
    topologyBlockId,
  }: {
    plotfieldCommandId: string;
    topologyBlockId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
  getCurrentAmountOfCommands: ({
    topologyBlockId,
  }: {
    topologyBlockId: string;
  }) => number;
  getFirstCommandByTopologyBlockId: ({
    topologyBlockId,
  }: {
    topologyBlockId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
  getCommandOnlyByPlotfieldCommandId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
  getCommandsByTopologyBlockId: ({
    topologyBlockId,
  }: {
    topologyBlockId: string;
  }) => PlotfieldOptimisticCommandTypes[];
  getPreviousCommandByPlotfieldId: ({
    plotfieldCommandId,
    topologyBlockId,
  }: {
    plotfieldCommandId: string;
    topologyBlockId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
  getNextCommandByPlotfieldId: ({
    plotfieldCommandId,
    topologyBlockId,
  }: {
    plotfieldCommandId: string;
    topologyBlockId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
  addCommand: ({
    newCommand,
    topologyBlockId,
  }: {
    newCommand: PlotfieldOptimisticCommandTypes;
    topologyBlockId: string;
  }) => void;
  updateFocuseReset: ({ value }: { value: boolean }) => void;
  updateCommandName: ({
    id,
    newCommand,
    sayType,
    characterId,
    characterName,
    characterImg,
  }: UpdateCommandNameTypes) => void;
  removeCommandItem: ({
    id,
    topologyBlockId,
  }: {
    id: string;
    topologyBlockId: string;
  }) => void;
  updateCommandOrder: ({
    commandOrder,
    id,
  }: {
    id: string;
    commandOrder: number;
  }) => void;
  updateSayType: ({
    sayType,
    id,
  }: {
    id: string;
    sayType: CommandSayVariationTypes;
  }) => void;
  updateCommandSide: ({
    commandSide,
    id,
  }: {
    id: string;
    commandSide: "left" | "right";
  }) => void;
  updateCharacterName: ({
    characterName,
    id,
  }: {
    id: string;
    characterName: string;
  }) => void;
  updateEmotionName: ({
    emotionName,
    id,
  }: {
    id: string;
    emotionName: string;
  }) => void;
  updateCharacterProperties: ({
    characterName,
    characterId,
    characterImg,
    id,
  }: {
    id: string;
    characterName: string;
    characterId: string;
    characterImg?: string;
  }) => void;
  updateEmotionProperties: ({
    emotionName,
    emotionId,
    emotionImg,
    id,
  }: {
    id: string;
    emotionName: string;
    emotionId: string;
    emotionImg?: string;
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
  focuseReset: false,
  commands: [
    {
      topologyBlockId: "",
      commands: [],
    },
  ],
  getFirstCommandByTopologyBlockId: ({ topologyBlockId }) => {
    const firstCommand = get().commands.find(
      (c) => c.topologyBlockId === topologyBlockId
    )?.commands[0];

    if (firstCommand) {
      return firstCommand;
    } else {
      return null;
    }
  },
  getCurrentAmountOfCommands: ({ topologyBlockId }) => {
    const currentAmount = get().commands.find(
      (c) => c.topologyBlockId === topologyBlockId
    )?.commands.length;
    return typeof currentAmount === "number" ? currentAmount : 0;
  },
  getCommandByPlotfieldCommandId: ({ topologyBlockId, plotfieldCommandId }) => {
    const allCommands =
      get()
        .commands.find((c) => c.topologyBlockId === topologyBlockId)
        ?.commands.find((c) => c._id === plotfieldCommandId) || null;

    return allCommands;
  },
  getCommandOnlyByPlotfieldCommandId: ({ plotfieldCommandId }) => {
    return (
      get()
        .commands.flatMap((c) => c.commands)
        .find((cc) => cc._id === plotfieldCommandId) || null
    );
  },
  getCommandsByTopologyBlockId: ({ topologyBlockId }) => {
    const allCommands =
      get().commands.find((c) => c.topologyBlockId === topologyBlockId)
        ?.commands || [];
    return allCommands;
  },
  getPreviousCommandByPlotfieldId: ({
    plotfieldCommandId,
    topologyBlockId,
  }) => {
    const allCommands =
      get().commands.find((c) => c.topologyBlockId === topologyBlockId)
        ?.commands || [];
    const currentCommandIndex = allCommands.findIndex(
      (c) => c._id === plotfieldCommandId
    );
    if (currentCommandIndex === 0) {
      return null;
    }
    return allCommands[currentCommandIndex - 1];
  },
  getNextCommandByPlotfieldId: ({ plotfieldCommandId, topologyBlockId }) => {
    const allCommands =
      get().commands.find((c) => c.topologyBlockId === topologyBlockId)
        ?.commands || [];

    const currentCommandIndex = allCommands.findIndex(
      (c) => c._id === plotfieldCommandId
    );

    if (
      currentCommandIndex !== -1 &&
      currentCommandIndex < allCommands.length - 1
    ) {
      return allCommands[currentCommandIndex + 1];
    }

    return null;
  },
  addCommand: ({ newCommand, topologyBlockId }) =>
    set((state) => {
      const existingBlock = state.commands.find(
        (block) => block.topologyBlockId === topologyBlockId
      );

      if (existingBlock) {
        const updatedCommands = existingBlock.commands.map((command) =>
          command.commandOrder >= newCommand.commandOrder &&
          command._id !== newCommand._id
            ? { ...command, commandOrder: command.commandOrder + 1 }
            : command
        );

        return {
          commands: state.commands.map((block) =>
            block.topologyBlockId === topologyBlockId
              ? {
                  ...block,
                  commands: [...updatedCommands, newCommand].sort(
                    (a, b) => a.commandOrder - b.commandOrder
                  ),
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
  updateFocuseReset: ({ value }) =>
    set(() => ({
      focuseReset: value,
    })),
  updateCommandName: ({
    id,
    newCommand,
    sayType,
    characterId,
    characterName,
    characterImg,
  }: {
    id: string;
    newCommand: AllPossiblePlotFieldComamndsTypes;
    sayType?: CommandSayVariationTypes;
    characterId?: string;
    characterName?: string;
    characterImg?: string;
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
                characterImg,
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
  updateCharacterName: ({ id, characterName }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) =>
          command._id === id ? { ...command, characterName } : command
        ),
      })),
    })),
  updateEmotionName: ({ id, emotionName }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) =>
          command._id === id ? { ...command, emotionName } : command
        ),
      })),
    })),
  updateCommandSide: ({ id, commandSide }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) =>
          command._id === id ? { ...command, commandSide } : command
        ),
      })),
    })),
  updateEmotionProperties: ({ id, emotionName, emotionId, emotionImg }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) =>
          command._id === id
            ? { ...command, emotionName, emotionId, emotionImg }
            : command
        ),
      })),
    })),
  updateCharacterProperties: ({
    id,
    characterId,
    characterName,
    characterImg,
  }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) =>
          command._id === id
            ? { ...command, characterId, characterName, characterImg }
            : command
        ),
      })),
    })),
  updateSayType: ({ id, sayType }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) =>
          command._id === id ? { ...command, sayType } : command
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
  removeCommandItem: ({ id, topologyBlockId }) =>
    set((state) => {
      const updatedCommands = state.commands.map((block) => {
        if (block.topologyBlockId !== topologyBlockId) return block;

        const commandToRemove = block.commands.find(
          (command) => command._id === id
        );
        if (!commandToRemove) return block;

        const removedCommandOrder = commandToRemove.commandOrder;

        const updatedBlockCommands = block.commands
          .filter((command) => command._id !== id)
          .map((command) =>
            command.commandOrder > removedCommandOrder
              ? { ...command, commandOrder: command.commandOrder - 1 }
              : command
          );

        return {
          ...block,
          commands: updatedBlockCommands,
        };
      });

      return {
        commands: updatedCommands,
      };
    }),
  clearCommand: () =>
    set(() => ({
      commands: [],
    })),
});

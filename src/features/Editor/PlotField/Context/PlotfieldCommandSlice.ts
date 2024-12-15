import { StateCreator } from "zustand";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";

export type PlotfieldOptimisticCommandTypes = {
  _id: string; //plotfieldCommandId
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
  isElse?: boolean; //typeof boolean, if so, means that this command is inside commandIf
  plotfieldCommandIfId?: string;
};

type UpdateCommandNameTypes = {
  id: string;
  topologyBlockId: string;
  newCommand: AllPossiblePlotFieldComamndsTypes;
  sayType?: CommandSayVariationTypes;
  characterId?: string;
  characterName?: string;
  characterImg?: string;

  plotfieldCommandIfId?: string;
  plotfieldCommandElseId?: string;
  plotfieldCommandIfElseEndId?: string;
};

export type CreatePlotfieldCommandSliceTypes = {
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
  getCurrentAmountOfCommands: ({ topologyBlockId }: { topologyBlockId: string }) => number;
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
  getCommandsByTopologyBlockId: ({ topologyBlockId }: { topologyBlockId: string }) => PlotfieldOptimisticCommandTypes[];
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
    plotfieldCommandIfId,
    isElse,
  }: {
    newCommand: PlotfieldOptimisticCommandTypes;
    topologyBlockId: string;
    plotfieldCommandIfId?: string;

    plotfieldCommandElseId?: string;
    plotfieldCommandIfElseEndId?: string;
    isElse?: boolean;
  }) => void;
  updateCommandName: ({
    id,
    newCommand,
    sayType,
    characterId,
    characterName,
    characterImg,
    plotfieldCommandIfId,
  }: UpdateCommandNameTypes) => void;
  removeCommandItem: ({ id, topologyBlockId }: { id: string; topologyBlockId: string }) => void;
  updateCommandOrder: ({
    commandOrder,
    topologyBlockId,
    id,
  }: {
    id: string;
    topologyBlockId: string;
    commandOrder: number;
  }) => void;
  updateSayType: ({ sayType, id }: { id: string; sayType: CommandSayVariationTypes }) => void;
  updateCommandSide: ({ commandSide, id }: { id: string; commandSide: "left" | "right" }) => void;
  updateCharacterName: ({ characterName, id }: { id: string; characterName: string }) => void;
  updateEmotionName: ({ emotionName, id }: { id: string; emotionName: string }) => void;
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
  commands: [
    {
      topologyBlockId: "",
      commands: [],
    },
  ],
  getFirstCommandByTopologyBlockId: ({ topologyBlockId }) => {
    const firstCommand = get().commands.find((c) => c.topologyBlockId === topologyBlockId)?.commands[0];

    if (firstCommand) {
      return firstCommand;
    } else {
      return null;
    }
  },
  getCurrentAmountOfCommands: ({ topologyBlockId }) => {
    const currentAmount = get().commands.find((c) => c.topologyBlockId === topologyBlockId)?.commands.length;
    return typeof currentAmount === "number" ? currentAmount : 1;
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
    const allCommands = get().commands.find((c) => c.topologyBlockId === topologyBlockId)?.commands || [];
    return allCommands;
  },
  getPreviousCommandByPlotfieldId: ({ plotfieldCommandId, topologyBlockId }) => {
    const allCommands = get().commands.find((c) => c.topologyBlockId === topologyBlockId)?.commands || [];
    const currentCommandIndex = allCommands.findIndex((c) => c._id === plotfieldCommandId);
    if (currentCommandIndex === 0) {
      return null;
    }
    return allCommands[currentCommandIndex - 1];
  },
  getNextCommandByPlotfieldId: ({ plotfieldCommandId, topologyBlockId }) => {
    const allCommands = get().commands.find((c) => c.topologyBlockId === topologyBlockId)?.commands || [];

    const currentCommandIndex = allCommands.findIndex((c) => c._id === plotfieldCommandId);

    if (currentCommandIndex !== -1 && currentCommandIndex < allCommands.length - 1) {
      return allCommands[currentCommandIndex + 1];
    }

    return null;
  },
  addCommand: ({
    newCommand,
    topologyBlockId,
    isElse,
    plotfieldCommandIfId,
    plotfieldCommandElseId,
    plotfieldCommandIfElseEndId,
  }) =>
    set((state) => {
      const existingBlock = state.commands.find((block) => block.topologyBlockId === topologyBlockId);

      if (existingBlock) {
        if (newCommand.command === "if" && newCommand) {
          const newElseCommand: PlotfieldOptimisticCommandTypes = {
            _id: plotfieldCommandElseId || "",
            command: "else",
            commandOrder: newCommand.commandOrder + 1,
            topologyBlockId,
            plotfieldCommandIfId,
          };
          const newIfElseEndCommand: PlotfieldOptimisticCommandTypes = {
            _id: plotfieldCommandIfElseEndId || "",
            command: "end",
            commandOrder: newCommand.commandOrder + 2,
            topologyBlockId,
            plotfieldCommandIfId,
          };

          const updatedCommandsBesideIf = existingBlock.commands.map((c) =>
            c._id !== newCommand._id && c.commandOrder > newCommand.commandOrder
              ? { ...c, commandOrder: c.commandOrder + 2 }
              : c
          );

          return {
            commands: state.commands.map((c) =>
              c.topologyBlockId === topologyBlockId
                ? {
                    ...c,
                    commands: [...updatedCommandsBesideIf, newCommand, newElseCommand, newIfElseEndCommand].sort(
                      (a, b) => a.commandOrder - b.commandOrder
                    ),
                  }
                : c
            ),
          };
        } else {
          const updatedCommands = existingBlock.commands.map((command) =>
            command.commandOrder >= newCommand.commandOrder && command._id !== newCommand._id
              ? { ...command, commandOrder: command.commandOrder + 1, plotfieldCommandIfId, isElse }
              : command
          );

          return {
            commands: state.commands.map((block) =>
              block.topologyBlockId === topologyBlockId
                ? {
                    ...block,
                    commands: [...updatedCommands, newCommand].sort((a, b) => a.commandOrder - b.commandOrder),
                  }
                : block
            ),
          };
        }
      } else {
        return {
          commands: [...state.commands, { topologyBlockId, commands: [newCommand] }],
        };
      }
    }),
  updateCommandName: ({
    id,
    newCommand,
    topologyBlockId,
    characterId,
    characterImg,
    characterName,
    plotfieldCommandIfId,
    plotfieldCommandElseId,
    plotfieldCommandIfElseEndId,
    sayType,
  }: UpdateCommandNameTypes) =>
    set((state) => {
      const existingTopologyBlock = state.commands.find((c) => c.topologyBlockId === topologyBlockId);

      if (!existingTopologyBlock) {
        return { ...state };
      }

      const updatedCommands = existingTopologyBlock.commands.map((c) =>
        c._id === id ? { ...c, command: newCommand, characterId, characterImg, characterName, sayType } : c
      );
      const currentCommand = updatedCommands.find((c) => c._id === id);
      if (newCommand === "if" && currentCommand) {
        const newElseCommand: PlotfieldOptimisticCommandTypes = {
          _id: plotfieldCommandElseId || "",
          command: "else",
          commandOrder: currentCommand.commandOrder + 1,
          topologyBlockId,
          plotfieldCommandIfId,
        };
        const newIfElseEndCommand: PlotfieldOptimisticCommandTypes = {
          _id: plotfieldCommandIfElseEndId || "",
          command: "end",
          commandOrder: currentCommand.commandOrder + 2,
          topologyBlockId,
          plotfieldCommandIfId,
        };

        const updatedCommandsBesideIf = existingTopologyBlock.commands.map((c) =>
          c._id !== id && c.commandOrder > currentCommand.commandOrder ? { ...c, commandOrder: c.commandOrder + 2 } : c
        );

        return {
          commands: state.commands.map((c) =>
            c.topologyBlockId === topologyBlockId
              ? {
                  ...c,
                  commands: [...updatedCommandsBesideIf, newElseCommand, newIfElseEndCommand].sort(
                    (a, b) => a.commandOrder - b.commandOrder
                  ),
                }
              : c
          ),
        };
      }

      return {
        commands: state.commands.map((c) =>
          c.topologyBlockId === topologyBlockId ? { ...c, commands: updatedCommands } : c
        ),
      };
    }),
  updateCommandOrder: ({ id, topologyBlockId, commandOrder }) =>
    set((state) => {
      const existingBlock = state.commands.find((c) => c.topologyBlockId === topologyBlockId);

      if (!existingBlock) {
        return { ...state };
      }

      const currentCommand = existingBlock.commands.find((c) => c._id === id);

      if (!currentCommand) {
        return { ...state };
      }

      const updatedCommands = existingBlock.commands.map((c) =>
        c.commandOrder >= commandOrder && c._id !== id //updating all commands after dragged command
          ? { ...c, commandOrder: c.commandOrder + 1 }
          : c._id !== id && c.commandOrder < commandOrder && c.commandOrder > currentCommand.commandOrder //updating all commands before dragged command
          ? { ...c, commandOrder: c.commandOrder - 1 }
          : c._id === id //updating dragged command
          ? { ...c, commandOrder }
          : c
      );

      return {
        commands: state.commands.map((c) =>
          c.topologyBlockId === topologyBlockId ? { ...c, commands: updatedCommands } : c
        ),
      };
    }),
  updateCharacterName: ({ id, characterName }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) => (command._id === id ? { ...command, characterName } : command)),
      })),
    })),
  updateEmotionName: ({ id, emotionName }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) => (command._id === id ? { ...command, emotionName } : command)),
      })),
    })),
  updateCommandSide: ({ id, commandSide }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) => (command._id === id ? { ...command, commandSide } : command)),
      })),
    })),
  updateEmotionProperties: ({ id, emotionName, emotionId, emotionImg }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) =>
          command._id === id ? { ...command, emotionName, emotionId, emotionImg } : command
        ),
      })),
    })),
  updateCharacterProperties: ({ id, characterId, characterName, characterImg }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) =>
          command._id === id ? { ...command, characterId, characterName, characterImg } : command
        ),
      })),
    })),
  updateSayType: ({ id, sayType }) =>
    set((state) => ({
      commands: state.commands.map((block) => ({
        ...block,
        commands: block.commands.map((command) => (command._id === id ? { ...command, sayType } : command)),
      })),
    })),
  setAllCommands: ({ commands, topologyBlockId }) =>
    set((state) => {
      const existingBlock = state.commands.find((block) => block.topologyBlockId === topologyBlockId);

      if (existingBlock) {
        return {
          commands: state.commands.map((block) =>
            block.topologyBlockId === topologyBlockId ? { ...block, commands } : block
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

        const commandToRemove = block.commands.find((command) => command._id === id);
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

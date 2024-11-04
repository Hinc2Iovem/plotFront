import { StateCreator } from "zustand";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";

export type PlotfieldOptimisticCommandInsideIfTypes = {
  _id: string;
  command: AllPossiblePlotFieldComamndsTypes;
  commandOrder: number;
  topologyBlockId: string;
  commandSide: "right" | "left";

  sayType?: CommandSayVariationTypes;

  characterId?: string;
  characterName?: string;
  characterImg?: string;

  emotionName?: string;
  emotionId?: string;
  emotionImg?: string;

  commandIfId: string;
  isElse: boolean;
};

type UpdateCommandNameTypes = {
  id: string;
  newCommand: AllPossiblePlotFieldComamndsTypes;
  sayType?: CommandSayVariationTypes;
  characterId?: string;
  characterName?: string;
  isElse: boolean;
};

export type CreatePlotfieldCommandIfSliceTypes = {
  focuseIfReset: boolean;
  commandsIf: {
    commandIfId: string;
    commandsInsideIf: PlotfieldOptimisticCommandInsideIfTypes[];
    commandsInsideElse: PlotfieldOptimisticCommandInsideIfTypes[];
  }[];
  getCommandsByCommandIfId: ({
    commandIfId,
    isElse,
  }: {
    commandIfId: string;
    isElse: boolean;
  }) => PlotfieldOptimisticCommandInsideIfTypes[];
  getCurrentAmountOfIfCommands: ({
    commandIfId,
    isElse,
  }: {
    commandIfId: string;
    isElse: boolean;
  }) => number;
  getCommandIfByPlotfieldCommandId: ({
    plotfieldCommandId,
    commandIfId,
    isElse,
  }: {
    plotfieldCommandId: string;
    commandIfId: string;
    isElse: boolean;
  }) => PlotfieldOptimisticCommandInsideIfTypes | null;
  getPreviousCommandIfByPlotfieldId: ({
    commandIfId,
    plotfieldCommandId,
    isElse,
  }: {
    commandIfId: string;
    plotfieldCommandId: string;
    isElse: boolean;
  }) => PlotfieldOptimisticCommandInsideIfTypes | null;
  getNextCommandIfByPlotfieldId: ({
    commandIfId,
    plotfieldCommandId,
    isElse,
  }: {
    commandIfId: string;
    plotfieldCommandId: string;
    isElse: boolean;
  }) => PlotfieldOptimisticCommandInsideIfTypes | null;
  getFirstCommandInsideIf: ({
    commandIfId,
    isElse,
  }: {
    commandIfId: string;
    isElse: boolean;
  }) => PlotfieldOptimisticCommandInsideIfTypes | null;
  addCommandIf: ({
    commandIfId,
    newCommand,
    isElse,
  }: {
    newCommand: PlotfieldOptimisticCommandInsideIfTypes;
    commandIfId: string;
    isElse: boolean;
  }) => void;
  updateCommandIfName: ({
    id,
    newCommand,
    sayType,
    characterId,
    characterName,
    isElse,
  }: UpdateCommandNameTypes) => void;
  updateCommandIfOrder: ({
    commandOrder,
    id,
    isElse,
  }: {
    id: string;
    commandOrder: number;
    isElse: boolean;
  }) => void;
  updateSayTypeIf: ({
    sayType,
    id,
    isElse,
  }: {
    id: string;
    sayType: CommandSayVariationTypes;
    isElse: boolean;
  }) => void;
  updateCommandIfSide: ({
    commandSide,
    id,
    isElse,
  }: {
    id: string;
    commandSide: "left" | "right";
    isElse: boolean;
  }) => void;
  updateCharacterNameIf: ({
    characterName,
    id,
    isElse,
  }: {
    id: string;
    characterName: string;
    isElse: boolean;
  }) => void;
  updateEmotionNameIf: ({
    emotionName,
    id,
    isElse,
  }: {
    id: string;
    emotionName: string;
    isElse: boolean;
  }) => void;
  updateFocuseIfReset: ({ value }: { value: boolean }) => void;
  updateCharacterPropertiesIf: ({
    characterName,
    characterId,
    characterImg,
    id,
    isElse,
  }: {
    id: string;
    characterName: string;
    characterId: string;
    characterImg?: string;
    isElse: boolean;
  }) => void;
  updateEmotionPropertiesIf: ({
    emotionName,
    emotionId,
    emotionImg,
    id,
    isElse,
  }: {
    id: string;
    emotionName: string;
    emotionId: string;
    emotionImg?: string;
    isElse: boolean;
  }) => void;
  setAllIfCommands: ({
    commandIfId,
    commandsInsideIf,
    commandsInsideElse,
  }: {
    commandsInsideIf: PlotfieldOptimisticCommandInsideIfTypes[];
    commandsInsideElse: PlotfieldOptimisticCommandInsideIfTypes[];
    commandIfId: string;
  }) => void;
  removeCommandIfItem: ({
    isElse,
    id,
    commandIfId,
  }: {
    isElse: boolean;
    id: string;
    commandIfId: string;
  }) => void;
  clearCommandIf: () => void;
};

export const createPlotfieldIfCommandSlice: StateCreator<
  CreatePlotfieldCommandIfSliceTypes,
  [],
  [],
  CreatePlotfieldCommandIfSliceTypes
> = (set, get) => ({
  focuseIfReset: false,
  commandsIf: [
    {
      commandIfId: "",
      commandsInsideIf: [],
      commandsInsideElse: [],
    },
  ],
  getCommandIfByPlotfieldCommandId: ({
    plotfieldCommandId,
    isElse,
    commandIfId,
  }) => {
    if (isElse) {
      const command =
        get()
          .commandsIf.find((c) => c.commandIfId === commandIfId)
          ?.commandsInsideElse.find((c) => c._id === plotfieldCommandId) ||
        null;
      return command;
    } else {
      const command =
        get()
          .commandsIf.find((c) => c.commandIfId === commandIfId)
          ?.commandsInsideIf.find((c) => c._id === plotfieldCommandId) || null;
      return command;
    }
  },
  getCurrentAmountOfIfCommands: ({ commandIfId, isElse }) => {
    if (isElse) {
      const currentAmount =
        get().commandsIf.find((c) => c.commandIfId === commandIfId)
          ?.commandsInsideElse.length || 0;
      return currentAmount;
    } else {
      const currentAmount =
        get().commandsIf.find((c) => c.commandIfId === commandIfId)
          ?.commandsInsideIf.length || 0;
      return currentAmount;
    }
  },
  getPreviousCommandIfByPlotfieldId: ({
    plotfieldCommandId,
    commandIfId,
    isElse,
  }) => {
    if (isElse) {
      const allCommands =
        get().commandsIf.find((c) => c.commandIfId === commandIfId)
          ?.commandsInsideElse || [];
      const currentCommandIndex = allCommands.findIndex(
        (c) => c._id === plotfieldCommandId
      );
      if (currentCommandIndex === 0) {
        return null;
      }
      return allCommands[currentCommandIndex - 1];
    } else {
      const allCommands =
        get().commandsIf.find((c) => c.commandIfId === commandIfId)
          ?.commandsInsideIf || [];
      const currentCommandIndex = allCommands.findIndex(
        (c) => c._id === plotfieldCommandId
      );
      if (currentCommandIndex === 0) {
        return null;
      }
      return allCommands[currentCommandIndex - 1];
    }
  },
  getNextCommandIfByPlotfieldId: ({
    plotfieldCommandId,
    commandIfId,
    isElse,
  }) => {
    if (isElse) {
      const allCommands =
        get().commandsIf.find((c) => c.commandIfId === commandIfId)
          ?.commandsInsideElse || [];

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
    } else {
      const allCommands =
        get().commandsIf.find((c) => c.commandIfId === commandIfId)
          ?.commandsInsideIf || [];

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
    }
  },
  getCommandsByCommandIfId: ({ commandIfId, isElse }) => {
    if (isElse) {
      const allCommands =
        get().commandsIf.find((c) => c.commandIfId === commandIfId)
          ?.commandsInsideElse || [];
      return allCommands;
    } else {
      const allCommands =
        get().commandsIf.find((c) => c.commandIfId === commandIfId)
          ?.commandsInsideIf || [];
      return allCommands;
    }
  },
  getFirstCommandInsideIf: ({ commandIfId, isElse }) => {
    if (isElse) {
      const firstCommand =
        get()
          .commandsIf.find((c) => c.commandIfId === commandIfId)
          ?.commandsInsideElse.find((c) => c.commandOrder === 0) || null;
      return firstCommand;
    } else {
      const firstCommand =
        get()
          .commandsIf.find((c) => c.commandIfId === commandIfId)
          ?.commandsInsideIf.find((c) => c.commandOrder === 0) || null;
      return firstCommand;
    }
  },
  addCommandIf: ({ commandIfId, isElse, newCommand }) =>
    set((state) => {
      const existingBlock = state.commandsIf.find(
        (block) => block.commandIfId === commandIfId
      );

      if (existingBlock) {
        const commandListKey = isElse
          ? "commandsInsideElse"
          : "commandsInsideIf";
        const updatedCommands = existingBlock[commandListKey].map((command) =>
          command.commandOrder >= newCommand.commandOrder &&
          command._id !== newCommand._id
            ? { ...command, commandOrder: command.commandOrder + 1 }
            : command
        );

        return {
          commandsIf: state.commandsIf.map((block) =>
            block.commandIfId === commandIfId
              ? {
                  ...block,
                  [commandListKey]: [...updatedCommands, newCommand].sort(
                    (a, b) => a.commandOrder - b.commandOrder
                  ),
                }
              : block
          ),
        };
      } else {
        const newBlock = isElse
          ? {
              commandIfId,
              commandsInsideIf: [],
              commandsInsideElse: [newCommand],
            }
          : {
              commandIfId,
              commandsInsideIf: [newCommand],
              commandsInsideElse: [],
            };

        return {
          commandsIf: [...state.commandsIf, newBlock],
        };
      }
    }),
  updateFocuseIfReset: ({ value }) =>
    set(() => ({
      focuseIfReset: value,
    })),
  updateCommandIfName: ({
    id,
    newCommand,
    sayType,
    characterId,
    characterName,
    isElse,
  }) =>
    set((state) => ({
      commandsIf: state.commandsIf.map((block) => {
        if (isElse) {
          return {
            ...block,
            commandsInsideElse: block.commandsInsideElse.map((ce) =>
              ce._id === id
                ? {
                    ...ce,
                    command: newCommand,
                    sayType,
                    characterId,
                    characterName,
                  }
                : ce
            ),
          };
        } else {
          return {
            ...block,
            commandsInsideIf: block.commandsInsideIf.map((ci) =>
              ci._id === id
                ? {
                    ...ci,
                    command: newCommand,
                    sayType,
                    characterId,
                    characterName,
                  }
                : ci
            ),
          };
        }
      }),
    })),
  updateCommandIfOrder: ({ id, commandOrder, isElse }) =>
    set((state) => {
      const blockIndex = state.commandsIf.findIndex(
        (block) =>
          block.commandsInsideIf.some((ci) => ci._id === id) ||
          block.commandsInsideElse.some((ce) => ce._id === id)
      );

      if (blockIndex === -1) return state;

      const block = state.commandsIf[blockIndex];
      const commandsList = isElse
        ? block.commandsInsideElse
        : block.commandsInsideIf;

      const commandIndex = commandsList.findIndex((cmd) => cmd._id === id);
      if (commandIndex === -1) return state;

      const oldOrder = commandsList[commandIndex].commandOrder;
      const difference = oldOrder - commandOrder;

      if (Math.abs(difference) === 1) {
        const adjacentCommand = commandsList.find(
          (cmd) => cmd.commandOrder === commandOrder
        );

        if (adjacentCommand) {
          [
            adjacentCommand.commandOrder,
            commandsList[commandIndex].commandOrder,
          ] = [oldOrder, commandOrder];
        }
      } else {
        const commandsToUpdate = commandsList.filter((cmd) =>
          oldOrder > commandOrder
            ? cmd.commandOrder >= commandOrder && cmd.commandOrder < oldOrder
            : cmd.commandOrder > oldOrder && cmd.commandOrder <= commandOrder
        );

        commandsToUpdate.forEach((cmd) => {
          cmd.commandOrder =
            oldOrder > commandOrder
              ? cmd.commandOrder + 1
              : cmd.commandOrder - 1;
        });

        commandsList[commandIndex].commandOrder = commandOrder;
      }

      const updatedCommandsIf = state.commandsIf.map((block, i) => {
        if (i === blockIndex) {
          return isElse
            ? { ...block, commandsInsideElse: commandsList }
            : { ...block, commandsInsideIf: commandsList };
        }
        return block;
      });

      return { commandsIf: updatedCommandsIf };
    }),
  updateCharacterNameIf: ({ id, characterName, isElse }) =>
    set((state) => ({
      commandsIf: state.commandsIf.map((block) => ({
        ...block,
        [isElse ? "commandsInsideElse" : "commandsInsideIf"]: block[
          isElse ? "commandsInsideElse" : "commandsInsideIf"
        ].map((command) =>
          command._id === id ? { ...command, characterName } : command
        ),
      })),
    })),

  updateEmotionNameIf: ({ id, emotionName, isElse }) =>
    set((state) => ({
      commandsIf: state.commandsIf.map((block) => ({
        ...block,
        [isElse ? "commandsInsideElse" : "commandsInsideIf"]: block[
          isElse ? "commandsInsideElse" : "commandsInsideIf"
        ].map((command) =>
          command._id === id ? { ...command, emotionName } : command
        ),
      })),
    })),

  updateCommandIfSide: ({ id, commandSide, isElse }) =>
    set((state) => ({
      commandsIf: state.commandsIf.map((block) => ({
        ...block,
        [isElse ? "commandsInsideElse" : "commandsInsideIf"]: block[
          isElse ? "commandsInsideElse" : "commandsInsideIf"
        ].map((command) =>
          command._id === id ? { ...command, commandSide } : command
        ),
      })),
    })),

  updateEmotionPropertiesIf: ({
    id,
    emotionName,
    emotionId,
    emotionImg,
    isElse,
  }) =>
    set((state) => ({
      commandsIf: state.commandsIf.map((block) => ({
        ...block,
        [isElse ? "commandsInsideElse" : "commandsInsideIf"]: block[
          isElse ? "commandsInsideElse" : "commandsInsideIf"
        ].map((command) =>
          command._id === id
            ? { ...command, emotionName, emotionId, emotionImg }
            : command
        ),
      })),
    })),

  updateCharacterPropertiesIf: ({
    id,
    characterId,
    characterName,
    characterImg,
    isElse,
  }) =>
    set((state) => ({
      commandsIf: state.commandsIf.map((block) => ({
        ...block,
        [isElse ? "commandsInsideElse" : "commandsInsideIf"]: block[
          isElse ? "commandsInsideElse" : "commandsInsideIf"
        ].map((command) =>
          command._id === id
            ? { ...command, characterId, characterName, characterImg }
            : command
        ),
      })),
    })),

  updateSayTypeIf: ({ id, sayType, isElse }) =>
    set((state) => ({
      commandsIf: state.commandsIf.map((block) => ({
        ...block,
        [isElse ? "commandsInsideElse" : "commandsInsideIf"]: block[
          isElse ? "commandsInsideElse" : "commandsInsideIf"
        ].map((command) =>
          command._id === id ? { ...command, sayType } : command
        ),
      })),
    })),
  setAllIfCommands: ({ commandsInsideElse, commandsInsideIf, commandIfId }) =>
    set((state) => {
      const existingBlock = state.commandsIf.find(
        (block) => block.commandIfId === commandIfId
      );

      if (existingBlock) {
        return {
          commandsIf: state.commandsIf.map((block) =>
            block.commandIfId === commandIfId
              ? { ...block, commandsInsideElse, commandsInsideIf }
              : block
          ),
        };
      } else {
        return {
          commandsIf: [
            ...state.commandsIf,
            { commandIfId, commandsInsideElse, commandsInsideIf },
          ],
        };
      }
    }),
  removeCommandIfItem: ({ id, isElse, commandIfId }) =>
    set((state) => {
      const updatedCommands = state.commandsIf.map((block) => {
        if (block.commandIfId !== commandIfId) return block;

        let commandToRemove;
        if (isElse) {
          commandToRemove = block.commandsInsideElse.find(
            (command) => command._id === id
          );
        } else {
          commandToRemove = block.commandsInsideIf.find(
            (command) => command._id === id
          );
        }

        if (!commandToRemove) return block;

        const removedCommandOrder = commandToRemove.commandOrder;

        if (isElse) {
          const updatedBlockCommands = block.commandsInsideElse
            .filter((command) => command._id !== id)
            .map((command) =>
              command.commandOrder > removedCommandOrder
                ? { ...command, commandOrder: command.commandOrder - 1 }
                : command
            );

          return {
            ...block,
            commandsInsideElse: updatedBlockCommands,
          };
        } else {
          const updatedBlockCommands = block.commandsInsideIf
            .filter((command) => command._id !== id)
            .map((command) =>
              command.commandOrder > removedCommandOrder
                ? { ...command, commandOrder: command.commandOrder - 1 }
                : command
            );

          return {
            ...block,
            commandsInsideIf: updatedBlockCommands,
          };
        }
      });

      return {
        commandsIf: updatedCommands,
      };
    }),
  clearCommandIf: () =>
    set(() => ({
      commandsIf: [],
    })),
});

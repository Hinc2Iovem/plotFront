import { StateCreator } from "zustand";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";

export type PlotfieldOptimisticCommandInsideIfTypes = {
  _id: string;
  command: AllPossiblePlotFieldComamndsTypes;
  commandOrder: number;
  topologyBlockId: string;
  sayType?: CommandSayVariationTypes;
  characterId?: string;
  characterName?: string;
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
  }: {
    isElse: boolean;
    id: string;
  }) => void;
  clearCommandIf: () => void;
};

export const createPlotfieldIfCommandSlice: StateCreator<
  CreatePlotfieldCommandIfSliceTypes,
  [],
  [],
  CreatePlotfieldCommandIfSliceTypes
> = (set, get) => ({
  commandsIf: [
    {
      commandIfId: "",
      commandsInsideIf: [],
      commandsInsideElse: [],
    },
  ],
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
  addCommandIf: ({ commandIfId, isElse, newCommand }) =>
    set((state) => {
      const existingBlock = state.commandsIf.find(
        (block) => block.commandIfId === commandIfId
      );

      if (existingBlock) {
        if (isElse) {
          return {
            commandsIf: state.commandsIf.map((block) =>
              block.commandIfId === commandIfId
                ? {
                    ...block,
                    commandsInsideElse: [
                      ...block.commandsInsideElse,
                      newCommand,
                    ],
                  }
                : block
            ),
          };
        } else {
          return {
            commandsIf: state.commandsIf.map((block) =>
              block.commandIfId === commandIfId
                ? {
                    ...block,
                    commandsInsideIf: [...block.commandsInsideIf, newCommand],
                  }
                : block
            ),
          };
        }
      } else {
        if (isElse) {
          return {
            commands: [
              ...state.commandsIf,
              {
                commandIfId,
                commandsInsideElse: [newCommand],
                commandsInsideIf: [],
              },
            ],
          };
        } else {
          return {
            commands: [
              ...state.commandsIf,
              {
                commandIfId,
                commandsInsideIf: [newCommand],
                commandsInsideElse: [],
              },
            ],
          };
        }
      }
    }),
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
  removeCommandIfItem: ({ isElse, id }) =>
    set((state) => {
      return {
        commandsIf: state.commandsIf.map((c) => {
          const updatedCommands = isElse
            ? c.commandsInsideElse.filter((ce) => ce._id !== id)
            : c.commandsInsideIf.filter((ci) => ci._id !== id);

          return isElse
            ? { ...c, commandsInsideElse: updatedCommands }
            : { ...c, commandsInsideIf: updatedCommands };
        }),
      };
    }),
  clearCommandIf: () =>
    set(() => ({
      commandsIf: [],
    })),
});

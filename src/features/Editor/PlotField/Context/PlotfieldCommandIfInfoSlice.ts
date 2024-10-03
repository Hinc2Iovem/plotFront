import { StateCreator } from "zustand";

type CommandsIfInfo = {
  amountOfCommandsInsideIf: number;
  amountOfCommandsInsideElse: number;
  commandIfId: string;
};

type UpdateCommandInfoSignType = "add" | "minus";

export type PlotfieldCommandIfInfoSliceTypes = {
  commandsIfInfo: CommandsIfInfo[];
  getCurrentAmountOfIfCommands: ({
    commandIfId,
    isElse,
  }: {
    commandIfId: string;
    isElse: boolean;
  }) => number;
  setCurrentAmountOfIfCommands: ({
    amountOfCommandsInsideElse,
    amountOfCommandsInsideIf,
    commandIfId,
  }: {
    commandIfId: string;
    amountOfCommandsInsideIf: number;
    amountOfCommandsInsideElse: number;
  }) => void;
  updateCommandIfInfo: ({
    addOrMinus,
    commandIfId,
    isElse,
  }: {
    commandIfId: string;
    isElse: boolean;
    addOrMinus: UpdateCommandInfoSignType;
  }) => void;
};

export const createPlotfieldCommandIfInfoSlice: StateCreator<
  PlotfieldCommandIfInfoSliceTypes,
  [],
  [],
  PlotfieldCommandIfInfoSliceTypes
> = (set, get) => ({
  commandsIfInfo: [],
  setCurrentAmountOfIfCommands: ({
    commandIfId,
    amountOfCommandsInsideElse,
    amountOfCommandsInsideIf,
  }) =>
    set((state) => {
      const existingInfo = state.commandsIfInfo.find(
        (c) => c.commandIfId === commandIfId
      );

      if (existingInfo) {
        return {
          commandsIfInfo: state.commandsIfInfo.map((c) =>
            c.commandIfId === commandIfId
              ? { ...c, amountOfCommandsInsideElse, amountOfCommandsInsideIf }
              : c
          ),
        };
      }

      return {
        commandsIfInfo: [
          ...state.commandsIfInfo,
          { commandIfId, amountOfCommandsInsideElse, amountOfCommandsInsideIf },
        ],
      };
    }),
  getCurrentAmountOfIfCommands: ({ commandIfId, isElse }) => {
    if (isElse) {
      const currentAmount =
        get().commandsIfInfo.find((c) => c.commandIfId === commandIfId)
          ?.amountOfCommandsInsideElse || 0;
      return currentAmount;
    } else {
      const currentAmount =
        get().commandsIfInfo.find((c) => c.commandIfId === commandIfId)
          ?.amountOfCommandsInsideIf || 0;
      return currentAmount;
    }
  },
  updateCommandIfInfo: ({ commandIfId, addOrMinus, isElse }) =>
    set((state) => ({
      commandsIfInfo: state.commandsIfInfo.map((c) =>
        c.commandIfId === commandIfId && isElse
          ? {
              ...c,
              amountOfCommandsInsideElse:
                addOrMinus === "add"
                  ? c.amountOfCommandsInsideElse + 1
                  : c.amountOfCommandsInsideElse - 1 > 0
                  ? 0
                  : c.amountOfCommandsInsideElse - 1,
            }
          : c.commandIfId === commandIfId && !isElse
          ? {
              ...c,
              amountOfCommandsInsideIf:
                addOrMinus === "add"
                  ? c.amountOfCommandsInsideIf + 1
                  : c.amountOfCommandsInsideIf - 1 > 0
                  ? 0
                  : c.amountOfCommandsInsideIf - 1,
            }
          : c
      ),
    })),
});

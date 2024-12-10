import { StateCreator } from "zustand";

type CommandsIfInfo = {
  amountOfCommandsInsideIf: number;
  amountOfCommandsInsideElse: number;
  commandIfId: string;
};

type UpdateCommandInfoSignType = "add" | "minus";

export type PlotfieldCommandIfInfoSliceTypes = {
  commandsIfInfo: CommandsIfInfo[];

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

export const createPlotfieldSearchSlice: StateCreator<
  PlotfieldCommandIfInfoSliceTypes,
  [],
  [],
  PlotfieldCommandIfInfoSliceTypes
> = (set) => ({
  commandsIfInfo: [],
  setCurrentAmountOfIfCommands: ({ commandIfId, amountOfCommandsInsideElse, amountOfCommandsInsideIf }) =>
    set((state) => {
      const existingInfo = state.commandsIfInfo.find((c) => c.commandIfId === commandIfId);

      if (existingInfo) {
        return {
          commandsIfInfo: state.commandsIfInfo.map((c) =>
            c.commandIfId === commandIfId ? { ...c, amountOfCommandsInsideElse, amountOfCommandsInsideIf } : c
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

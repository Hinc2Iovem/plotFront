import { StateCreator } from "zustand";

type CommandsIfInfo = {
  amountOfCommandsInsideIf: number;
  amountOfCommandsInsideElse: number;
  plotfieldCommandIfId: string;
};

type UpdateCommandInfoSignType = "add" | "minus";

export type PlotfieldCommandIfInfoSliceTypes = {
  commandsIfInfo: CommandsIfInfo[];

  setCurrentAmountOfIfCommands: ({
    amountOfCommandsInsideElse,
    amountOfCommandsInsideIf,
    plotfieldCommandIfId,
  }: {
    plotfieldCommandIfId: string;
    amountOfCommandsInsideIf: number;
    amountOfCommandsInsideElse: number;
  }) => void;
  updateCommandIfInfo: ({
    addOrMinus,
    plotfieldCommandIfId,
    isElse,
  }: {
    plotfieldCommandIfId: string;
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
  setCurrentAmountOfIfCommands: ({ plotfieldCommandIfId, amountOfCommandsInsideElse, amountOfCommandsInsideIf }) =>
    set((state) => {
      const existingInfo = state.commandsIfInfo.find((c) => c.plotfieldCommandIfId === plotfieldCommandIfId);

      if (existingInfo) {
        return {
          commandsIfInfo: state.commandsIfInfo.map((c) =>
            c.plotfieldCommandIfId === plotfieldCommandIfId
              ? { ...c, amountOfCommandsInsideElse, amountOfCommandsInsideIf }
              : c
          ),
        };
      }

      return {
        commandsIfInfo: [
          ...state.commandsIfInfo,
          { plotfieldCommandIfId, amountOfCommandsInsideElse, amountOfCommandsInsideIf },
        ],
      };
    }),
  updateCommandIfInfo: ({ plotfieldCommandIfId, addOrMinus, isElse }) =>
    set((state) => ({
      commandsIfInfo: state.commandsIfInfo.map((c) =>
        c.plotfieldCommandIfId === plotfieldCommandIfId && isElse
          ? {
              ...c,
              amountOfCommandsInsideElse:
                addOrMinus === "add"
                  ? c.amountOfCommandsInsideElse + 1
                  : c.amountOfCommandsInsideElse - 1 > 0
                  ? 0
                  : c.amountOfCommandsInsideElse - 1,
            }
          : c.plotfieldCommandIfId === plotfieldCommandIfId && !isElse
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

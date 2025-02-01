import { StateCreator } from "zustand";

type CommandsIfInfo = {
  amountOfCommandsInsideIf?: number;
  amountOfCommandsInsideElse?: number;
  plotfieldCommandIfId: string;
};

type UpdateCommandInfoSignType = "add" | "minus";

export type CommandIfInfoSliceTypes = {
  commandsIfInfo: CommandsIfInfo[];
  setCurrentAmountOfIfCommands: ({
    amountOfCommandsInsideElse,
    amountOfCommandsInsideIf,
    plotfieldCommandIfId,
  }: {
    plotfieldCommandIfId: string;
    amountOfCommandsInsideIf?: number;
    amountOfCommandsInsideElse?: number;
  }) => void;
  getCurrentAmountOfIfCommands: ({
    isElse,
    plotfieldCommandIfId,
  }: {
    plotfieldCommandIfId: string;
    isElse: boolean;
  }) => number;
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

export const createIfInfoSlice: StateCreator<CommandIfInfoSliceTypes, [], [], CommandIfInfoSliceTypes> = (
  set,
  get
) => ({
  commandsIfInfo: [],
  getCurrentAmountOfIfCommands: ({ isElse, plotfieldCommandIfId }) => {
    const currentIf = get().commandsIfInfo.find((c) => c.plotfieldCommandIfId === plotfieldCommandIfId);
    if (isElse) {
      return currentIf?.amountOfCommandsInsideElse || 0;
    } else {
      return currentIf?.amountOfCommandsInsideIf || 0;
    }
  },
  setCurrentAmountOfIfCommands: ({ plotfieldCommandIfId, amountOfCommandsInsideElse, amountOfCommandsInsideIf }) =>
    set((state) => {
      const existingInfo = state.commandsIfInfo.find((c) => c.plotfieldCommandIfId === plotfieldCommandIfId);

      if (existingInfo) {
        return {
          commandsIfInfo: state.commandsIfInfo.map((c) =>
            c.plotfieldCommandIfId === plotfieldCommandIfId
              ? {
                  ...c,
                  amountOfCommandsInsideElse:
                    typeof amountOfCommandsInsideElse === "number"
                      ? amountOfCommandsInsideElse
                      : c.amountOfCommandsInsideElse || 0,
                  amountOfCommandsInsideIf:
                    typeof amountOfCommandsInsideIf === "number"
                      ? amountOfCommandsInsideIf
                      : c.amountOfCommandsInsideIf || 0,
                }
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
                  ? (c.amountOfCommandsInsideElse || 0) + 1
                  : (c.amountOfCommandsInsideElse || 0) - 1 > 0
                  ? 0
                  : (c.amountOfCommandsInsideElse || 0) - 1,
            }
          : c.plotfieldCommandIfId === plotfieldCommandIfId && !isElse
          ? {
              ...c,
              amountOfCommandsInsideIf:
                addOrMinus === "add"
                  ? (c.amountOfCommandsInsideIf || 0) + 1
                  : (c.amountOfCommandsInsideIf || 0) - 1 > 0
                  ? 0
                  : (c.amountOfCommandsInsideIf || 0) - 1,
            }
          : c
      ),
    })),
});

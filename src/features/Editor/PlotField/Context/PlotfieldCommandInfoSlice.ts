import { StateCreator } from "zustand";

type CommandsInfo = {
  amountOfCommands: number;
  topologyBlockId: string;
};

type UpdateCommandInfoSignType = "add" | "minus";

export type PlotfieldCommandInfoSliceTypes = {
  commandsInfo: CommandsInfo[];
  getCurrentAmountOfCommands: ({
    topologyBlockId,
  }: {
    topologyBlockId: string;
  }) => number;
  setCurrentAmountOfCommands: ({
    amountOfCommands,
    topologyBlockId,
  }: {
    topologyBlockId: string;
    amountOfCommands: number;
  }) => void;
  updateCommandInfo: ({
    addOrMinus,
    topologyBlockId,
  }: {
    topologyBlockId: string;
    addOrMinus: UpdateCommandInfoSignType;
  }) => void;
};

export const createPlotfieldCommandInfoSlice: StateCreator<
  PlotfieldCommandInfoSliceTypes,
  [],
  [],
  PlotfieldCommandInfoSliceTypes
> = (set, get) => ({
  commandsInfo: [],
  setCurrentAmountOfCommands: ({ topologyBlockId, amountOfCommands }) =>
    set((state) => {
      const existingInfo = state.commandsInfo.find(
        (c) => c.topologyBlockId === topologyBlockId
      );

      if (existingInfo) {
        return {
          commandsInfo: state.commandsInfo.map((c) =>
            c.topologyBlockId === topologyBlockId
              ? { ...c, amountOfCommands }
              : c
          ),
        };
      }

      return {
        commandsInfo: [
          ...state.commandsInfo,
          { topologyBlockId, amountOfCommands },
        ],
      };
    }),
  getCurrentAmountOfCommands: ({ topologyBlockId }) => {
    const currentAmount =
      get().commandsInfo.find((c) => c.topologyBlockId === topologyBlockId)
        ?.amountOfCommands || 1;
    return currentAmount;
  },
  updateCommandInfo: ({ topologyBlockId, addOrMinus }) =>
    set((state) => ({
      commandsInfo: state.commandsInfo.map((c) =>
        c.topologyBlockId === topologyBlockId
          ? {
              ...c,
              amountOfCommands:
                addOrMinus === "add"
                  ? c.amountOfCommands + 1
                  : c.amountOfCommands - 1 > 0
                  ? 0
                  : c.amountOfCommands - 1,
            }
          : c
      ),
    })),
});

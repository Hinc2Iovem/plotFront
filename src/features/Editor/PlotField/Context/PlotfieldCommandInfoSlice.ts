import { StateCreator } from "zustand";

type CommandsInfo = {
  amountOfCommands: number;
  topologyBlockId: string;
};

export type UpdateCommandInfoSignType = "add" | "minus";

export type PlotfieldCommandInfoSliceTypes = {
  commandsInfo: CommandsInfo[];

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
> = (set) => ({
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

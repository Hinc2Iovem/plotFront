import { create } from "zustand";
import { PlotfieldOptimisticCommandTypes } from "../PlotfieldCommandSlice";
import { devtools } from "zustand/middleware";

export type AllPossibleCommandUndoTypes = "deleted" | "created";

// when command for example deleted, undo means it was recreated back, again means that after recreation it was deleted again
// when command for example copied, undo means it was deleted, again means that after deletion it was recreated again
export type AllPossibleCommandCurrentUndoStatusTypes = "undo" | "again";

type CommandUndoType = {
  undoType: AllPossibleCommandUndoTypes;
  emotionName?: string;
  currentUndoStatus?: AllPossibleCommandCurrentUndoStatusTypes;
};

export type PlotfieldOptimisticUndoCommandTypes = CommandUndoType & PlotfieldOptimisticCommandTypes;

type PlotfieldCommandsPossiblyBeingUndoTypes = {
  allCommands: {
    episodeId: string;
    topologyBlockId: string;
    commands: PlotfieldOptimisticUndoCommandTypes[];
  }[];
  getUndoCommandByCommandId: ({
    commandId,
    episodeId,
  }: {
    episodeId: string;
    commandId: string;
  }) => PlotfieldOptimisticUndoCommandTypes | null;
  setNewCommand: ({
    episodeId,
    newCommand,
    topologyBlockId,
  }: {
    newCommand: PlotfieldOptimisticUndoCommandTypes;
    episodeId: string;
    topologyBlockId: string;
  }) => void;
  updateCurrentCommandStatus: ({
    commandId,
    episodeId,
    commandStatus,
  }: {
    episodeId: string;
    commandStatus: AllPossibleCommandCurrentUndoStatusTypes;
    commandId: string;
  }) => PlotfieldOptimisticUndoCommandTypes | null;
  deleteCompletely: ({ commandId }: { commandId: string }) => void;
};

const usePlotfieldCommandPossiblyBeingUndo = create<PlotfieldCommandsPossiblyBeingUndoTypes>()(
  devtools(
    (set, get) => ({
      allCommands: [],
      getUndoCommandByCommandId: ({ commandId, episodeId }) => {
        const command = get()
          .allCommands.find((c) => c.episodeId === episodeId)
          ?.commands.find((c) => c._id === commandId);
        if (command) {
          return command;
        } else {
          return null;
        }
      },
      deleteCompletely: ({ commandId }) =>
        set((state) => ({
          allCommands: state.allCommands.map((c) => ({
            ...c,
            commands: c.commands.filter((cc) => cc._id !== commandId),
          })),
        })),
      setNewCommand: ({ episodeId, newCommand, topologyBlockId }) =>
        set((state) => {
          const currentCommands = state.allCommands.find(
            (c) => c.episodeId === episodeId && c.topologyBlockId === topologyBlockId
          );
          if (currentCommands) {
            return {
              allCommands: state.allCommands.map((c) =>
                c.episodeId === episodeId && c.topologyBlockId === topologyBlockId
                  ? { ...c, commands: [...c.commands, newCommand] }
                  : c
              ),
            };
          } else {
            return {
              allCommands: [...state.allCommands, { commands: [newCommand], episodeId, topologyBlockId }],
            };
          }
        }),
      updateCurrentCommandStatus: ({ commandId, episodeId, commandStatus }) => {
        const currentCommand = get()
          .allCommands.find((c) => c.episodeId === episodeId)
          ?.commands.find((c) => c._id === commandId);

        if (currentCommand) {
          set((state) => ({
            allCommands: state.allCommands.map((c) =>
              c.episodeId === episodeId
                ? {
                    ...c,
                    commands: c.commands.map((command) =>
                      command._id === commandId ? { ...command, currentUndoStatus: commandStatus } : command
                    ),
                  }
                : c
            ),
          }));
          return { ...currentCommand, currentUndoStatus: commandStatus };
        }

        return null;
      },
    }),
    { name: "CommandsPossiblyUndo", store: "CommandsPossiblyUndo" }
  )
);

export default usePlotfieldCommandPossiblyBeingUndo;

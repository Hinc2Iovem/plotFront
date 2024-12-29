import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { OmittedCommandNames } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { TopologyBlockTypes } from "../../../../types/TopologyBlock/TopologyBlockTypes";

// _id may be === plotfieldCommandId || conditionBlockId || choiceOptionId

export type CurrentlyFocusedVariationTypes = "command" | "choiceOption" | "conditionBlock";

const defaultValueTopologyBlock: TopologyBlockTypes = {
  _id: "",
  coordinatesX: 0,
  coordinatesY: 0,
  episodeId: "",
  isStartingTopologyBlock: false,
  topologyBlockInfo: {
    amountOfAchievements: 0,
    amountOfChildBlocks: 0,
    amountOfCommands: 0,
    amountOfParentBlocks: 0,
  },
  name: "",
};

export type CurrentlyFocusedCommandTypes = {
  _id: string; //for commands it's a plotfieldCommandId, for conditionBlocks its conditionBlockId, for choiceOptions its choiceOptionId
  commandName: OmittedCommandNames;
  isElse?: boolean;
  parentId?: string; //it's for conditionBlocks, ifs and choiceOptions basically plotfieldCommandId of them when focusing on commands inside of them
  type: CurrentlyFocusedVariationTypes;
  commandOrder?: number;
};

export type SetCurrentlyFocusedCommandTypes = Omit<CurrentlyFocusedCommandTypes, "_id"> & {
  currentlyFocusedCommandId: string;
};

const defaultValueFocusedCommand: CurrentlyFocusedCommandTypes = {
  _id: "",
  type: "command",
  commandName: "" as OmittedCommandNames,
};

type PartialTopologyBlockTypes = Partial<TopologyBlockTypes>;

type TopLevelNavigationStateTypes = {
  currentTopologyBlock: TopologyBlockTypes;
  currentlyFocusedCommandId: CurrentlyFocusedCommandTypes;
  setCurrentTopologyBlock: ({
    _id,
    coordinatesX,
    coordinatesY,
    episodeId,
    isStartingTopologyBlock,
    name,
    topologyBlockInfo,
  }: PartialTopologyBlockTypes) => void;
  setCurrentlyFocusedCommandId: ({
    currentlyFocusedCommandId,
    isElse,
    type,
    commandName,
    commandOrder,
    parentId,
  }: SetCurrentlyFocusedCommandTypes) => void;
  clearTopologyBlock: () => void;
  clearFocusedCommand: () => void;
  updateAmountOfChildBlocks: (sign: "add" | "minus") => void;
};

const useNavigation = create<TopLevelNavigationStateTypes>()(
  devtools(
    (set) => ({
      currentTopologyBlock: defaultValueTopologyBlock,
      currentlyFocusedCommandId: defaultValueFocusedCommand,
      setCurrentTopologyBlock: ({
        _id,
        coordinatesX,
        coordinatesY,
        episodeId,
        isStartingTopologyBlock,
        name,
        topologyBlockInfo,
      }) => {
        set({
          currentTopologyBlock: {
            _id: _id || "",
            coordinatesX: coordinatesX || defaultValueTopologyBlock.coordinatesX,
            coordinatesY: coordinatesY || defaultValueTopologyBlock.coordinatesY,
            episodeId: episodeId || defaultValueTopologyBlock.episodeId,
            isStartingTopologyBlock: isStartingTopologyBlock || defaultValueTopologyBlock.isStartingTopologyBlock,
            name: name || defaultValueTopologyBlock.name,
            topologyBlockInfo: topologyBlockInfo || defaultValueTopologyBlock.topologyBlockInfo,
          },
        });
      },
      clearFocusedCommand: () => {
        set({
          currentlyFocusedCommandId: {} as CurrentlyFocusedCommandTypes,
        });
      },
      clearTopologyBlock: () => {
        set({
          currentTopologyBlock: {} as TopologyBlockTypes,
        });
      },
      setCurrentlyFocusedCommandId: ({
        currentlyFocusedCommandId,
        isElse,
        type,
        commandName,
        commandOrder,
        parentId,
      }) => {
        if (currentlyFocusedCommandId?.trim().length) {
          set({
            currentlyFocusedCommandId: {
              _id: currentlyFocusedCommandId,
              isElse,
              type,
              commandName,
              commandOrder,
              parentId,
            },
          });
        }
      },
      updateAmountOfChildBlocks: (sign) =>
        set((state) => ({
          currentTopologyBlock: {
            ...state.currentTopologyBlock,
            topologyBlockInfo: {
              ...state.currentTopologyBlock.topologyBlockInfo,
              amountOfChildBlocks:
                sign === "add"
                  ? state.currentTopologyBlock.topologyBlockInfo.amountOfChildBlocks + 1
                  : Math.max(state.currentTopologyBlock.topologyBlockInfo.amountOfChildBlocks - 1, 0),
            },
          },
        })),
    }),
    { name: "NavigationName", store: "NavigationStore" }
  )
);

export default useNavigation;

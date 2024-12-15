import { AllPossiblePlotFieldComamndsTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";

export type CreateDuplicateTypes = {
  topologyBlockId: string;
  episodeId: string;
};

export type CreateDuplicateWithStoryTypes = {
  storyId: string;
} & CreateDuplicateTypes;

export type CreateDuplicateOnMutation = {
  commandOrder: number;
  commandIfId?: string;
  isElse?: boolean;
  topologyBlockId: string;
  commandName?: AllPossiblePlotFieldComamndsTypes;
  sayType?: CommandSayVariationTypes;
  characterId?: string;
  emotionName?: string;
  characterName?: string;
  plotfieldCommandId: string;
};

export type CreateDuplicateSayOnMutationTypes = {
  commandIfId?: string;
  characterImg?: string;
  commandSide?: "left" | "right";
  emotionId?: string;
  emotionImg?: string;
} & CreateDuplicateOnMutation;

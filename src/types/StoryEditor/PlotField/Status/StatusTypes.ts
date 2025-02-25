import { StatusTypes } from "@/types/StoryData/Status/StatusTypes";

export type CommandStatusTypes = {
  _id: string;
  plotFieldCommandId: string;
  status?: StatusTypes;
  characterId?: string;
};

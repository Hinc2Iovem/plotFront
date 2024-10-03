import { EpisodeStatusTypes } from "../Episode/EpisodeTypes";

export type StoryTypes = {
  _id: string;
  amountOfEpisodes: number;
  storyStatus: EpisodeStatusTypes;
  imgUrl?: string;
  storyStaffInfo?: {
    staffId: string;
    storyStatus: EpisodeStatusTypes;
  }[];
};

export type StoryInfoTypes = {
  _id: string;
  staffId: string;
  storyId: string;
  storyStatus: EpisodeStatusTypes;
};

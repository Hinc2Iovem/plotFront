import { EpisodeStatusTypes } from "../Episode/EpisodeTypes";

export type EpisodeInfoTypes = {
  episodeId: string;
  episodeStatus: EpisodeStatusTypes;
  staffId?: string;
  _id: string;
};

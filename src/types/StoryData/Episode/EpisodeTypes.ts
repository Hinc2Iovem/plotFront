export type EpisodeStatusTypes = "done" | "doing";

export type EpisodeTypes = {
  _id: string;
  seasonId: string;
  episodeOrder: number;
  episodeStatus: EpisodeStatusTypes;
};

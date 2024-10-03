import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { EpisodeStatusTypes } from "../../../types/StoryData/Episode/EpisodeTypes";
import { StoryTypes } from "../../../types/StoryData/Story/StoryTypes";

type FetchStoriesTypes = {
  page?: number;
  limit?: number;
  storyStatus: EpisodeStatusTypes;
};

type ResultObjTypes = {
  data: {
    next?: {
      page: number;
      limit: number;
    };
    prev?: {
      page: number;
      limit: number;
    };
    results: StoryTypes[] | [];
    amountOfStories: number;
  };
};

const fetchStories = async ({
  page,
  limit,
  storyStatus,
}: FetchStoriesTypes): Promise<ResultObjTypes> => {
  const res = await axiosCustomized.get(
    `/stories/status?page=${page}&limit=${limit}&storyStatus=${storyStatus}`
  );
  console.log(res);

  return res;
};

export default function useGetPaginatedStories({
  page,
  limit,
  storyStatus,
}: FetchStoriesTypes) {
  return useQuery({
    queryKey: ["stories", "pagination", storyStatus, page],
    queryFn: () => fetchStories({ limit, page, storyStatus }),
    placeholderData: keepPreviousData,
  });
}

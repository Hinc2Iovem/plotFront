import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { SoundTypes } from "../../../../types/StoryData/Sound/SoundTypes";

type GetPaginatedSoundsTypes = {
  storyId: string;
  page: number;
  limit: number;
};

export type AllMightySearchSoundResultTypes = {
  next: {
    page: number;
    limit: number;
  };
  prev: {
    page: number;
    prev: number;
  };
  results: SoundTypes[];
  amountOfElements: number;
};

export const fetchAllMightyPaginatedSounds = async ({
  limit,
  page,
  storyId,
}: GetPaginatedSoundsTypes): Promise<AllMightySearchSoundResultTypes> => {
  return await axiosCustomized
    .get(`/stories/sound/paginated/allMightySearch?storyId=${storyId}&page=${page}&limit=${limit}`)
    .then((r) => r.data);
};

export default function useGetPaginatedSounds({ storyId, limit, page }: GetPaginatedSoundsTypes) {
  return useQuery({
    queryKey: ["all-mighty-search", "story", storyId, "sound", "paginated", "page", page, "limit", limit],
    queryFn: () => fetchAllMightyPaginatedSounds({ limit, page, storyId }),
  });
}

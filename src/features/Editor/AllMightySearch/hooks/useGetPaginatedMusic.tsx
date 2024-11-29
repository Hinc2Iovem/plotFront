import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { MusicTypes } from "../../../../types/StoryData/Music/MusicTypes";

type GetPaginatedMusicTypes = {
  storyId: string;
  page: number;
  limit: number;
};

export type AllMightySearchMusicResultTypes = {
  next: {
    page: number;
    limit: number;
  };
  prev: {
    page: number;
    prev: number;
  };
  results: MusicTypes[];
  amountOfElements: number;
};

export const fetchAllMightyPaginatedMusic = async ({
  limit,
  page,
  storyId,
}: GetPaginatedMusicTypes): Promise<AllMightySearchMusicResultTypes> => {
  return await axiosCustomized
    .get(`/stories/music/paginated/allMightySearch?storyId=${storyId}&page=${page}&limit=${limit}`)
    .then((r) => r.data);
};

export default function useGetPaginatedMusic({ storyId, limit, page }: GetPaginatedMusicTypes) {
  return useInfiniteQuery({
    queryKey: ["all-mighty-search", "story", storyId, "music", "paginated", "page", page, "limit", limit],
    queryFn: () => fetchAllMightyPaginatedMusic({ limit, page, storyId }),
    enabled: !!page && !!storyId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage?.next?.page;
      return nextPage > 0 ? nextPage : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const prevPage = firstPage?.prev?.page;
      return prevPage > 0 ? prevPage : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

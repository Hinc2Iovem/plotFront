import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { KeyTypes } from "../../../../types/StoryEditor/PlotField/Key/KeyTypes";

type GetPaginatedKeyTypes = {
  storyId: string;
  page: number;
  limit: number;
};

export type AllMightySearchKeyResultTypes = {
  next: {
    page: number;
    limit: number;
  };
  prev: {
    page: number;
    limit: number;
  };
  results: KeyTypes[];
  amountOfElements: number;
};

export const fetchAllMightyPaginatedKey = async ({
  limit,
  page,
  storyId,
}: GetPaginatedKeyTypes): Promise<AllMightySearchKeyResultTypes> => {
  return await axiosCustomized
    .get(`/plotFieldCommands/keys/stories/paginated/allMightySearch?storyId=${storyId}&page=${page}&limit=${limit}`)
    .then((r) => r.data);
};

export default function useGetPaginatedKey({ storyId, limit, page }: GetPaginatedKeyTypes) {
  return useInfiniteQuery({
    queryKey: ["all-mighty-search", "story", storyId, "key", "paginated", "page", page, "limit", limit],
    queryFn: async () => await fetchAllMightyPaginatedKey({ limit, page, storyId }),
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
  });
}

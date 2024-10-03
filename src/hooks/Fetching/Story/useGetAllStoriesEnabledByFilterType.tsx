import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { StoryTypes } from "../../../types/StoryData/Story/StoryTypes";
import { StoryFilterTypes } from "../../../features/Story/Story";

export default function useGetAllStoriesEnabledByFilterType({
  storyFilter,
}: {
  storyFilter: StoryFilterTypes;
}) {
  return useQuery({
    queryKey: ["stories"],
    queryFn: async () =>
      await axiosCustomized.get<StoryTypes[]>(`/stories`).then((r) => r.data),
    enabled: storyFilter === "all",
  });
}

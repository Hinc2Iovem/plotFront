import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { StoryInfoTypes } from "../../../types/StoryData/Story/StoryTypes";

export default function useGetStoryAssignedWorkers({
  storyId,
}: {
  storyId: string;
}) {
  return useQuery({
    queryKey: ["storyInfo", storyId, "staff"],
    queryFn: async () =>
      await axiosCustomized
        .get<StoryInfoTypes[]>(`/stories/${storyId}/assignWorkers`)
        .then((r) => r.data),
  });
}

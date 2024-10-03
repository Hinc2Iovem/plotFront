import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { StoryInfoTypes } from "../../../types/StoryData/Story/StoryTypes";

export default function useGetSingleAssignedStory({
  storyId,
  staffId,
}: {
  storyId: string;
  staffId: string;
}) {
  return useQuery({
    queryKey: ["assignedStory", storyId, staffId],
    queryFn: async () =>
      await axiosCustomized.get<StoryInfoTypes>(
        `/stories/${storyId}/staff/${staffId}/assignWorkers`
      ),
  });
}

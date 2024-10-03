import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { StoryInfoTypes } from "../../../types/StoryData/Story/StoryTypes";

export default function useGetStoryAssignedWorkersEnabledModalOpen({
  storyId,
  showModal,
}: {
  storyId: string;
  showModal: boolean;
}) {
  return useQuery({
    queryKey: ["storyInfo", storyId, "staff"],
    queryFn: async () =>
      await axiosCustomized
        .get<StoryInfoTypes[]>(`/stories/${storyId}/assignWorkers`)
        .then((r) => r.data),
    enabled: showModal && !!storyId,
  });
}

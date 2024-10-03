import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";

type AssignWorkerTypes = {
  storyId: string;
  currentUserId: string;
};

type AssignWorkerOnMutationTypes = {
  staffId: string;
};

export default function useAssignWorker({
  storyId,
  currentUserId,
}: AssignWorkerTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["assignStory", storyId],
    mutationFn: async ({ staffId }: AssignWorkerOnMutationTypes) =>
      await axiosCustomized.patch(
        `/stories/${storyId}/staff/${staffId}/assignWorkers`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", storyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assignedStories", "staff", currentUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["translation", "assigned", "stories", "search"],
        predicate: (query) => {
          return (
            query.queryKey[0] === "translation" &&
            query.queryKey[1] === "assigned" &&
            query.queryKey[2] === "stories" &&
            query.queryKey[3] != null &&
            query.queryKey[4] != "search"
          );
        },
      });
    },
  });
}

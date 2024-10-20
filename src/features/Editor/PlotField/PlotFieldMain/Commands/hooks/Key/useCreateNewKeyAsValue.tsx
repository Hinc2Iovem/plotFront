import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateKeyTypes = {
  storyId: string;
};

export default function useCreateNewKeyAsValue({ storyId }: CreateKeyTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      keyName,
      keyId,
    }: {
      keyName: string;
      keyId: string;
    }) =>
      await axiosCustomized.post(`/plotFieldCommands/stories/${storyId}/keys`, {
        keyName,
        keyId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", storyId, "key"],
      });
    },
  });
}

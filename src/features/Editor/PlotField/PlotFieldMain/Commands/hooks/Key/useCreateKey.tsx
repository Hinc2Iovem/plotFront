import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateKeyTypes = {
  plotFieldCommandId: string;
  storyId: string;
};

export default function useCreateKey({
  plotFieldCommandId,
  storyId,
}: CreateKeyTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/stories/${storyId}/keys`
      ),
  });
}

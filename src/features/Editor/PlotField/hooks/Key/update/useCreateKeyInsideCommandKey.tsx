import { CommandKeyTypes } from "@/types/StoryEditor/PlotField/Key/KeyTypes";
import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type CreateKeyInsideCommandKeyTypes = {
  plotFieldCommandId: string;
};

type CreateKeyInsideCommandKeyBodyTypes = {
  keyId: string;
  storyId: string;
  text: string;
};

export default function useCreateKeyInsideCommandKey({ plotFieldCommandId }: CreateKeyInsideCommandKeyTypes) {
  return useMutation({
    mutationFn: async ({ keyId, storyId, text }: CreateKeyInsideCommandKeyBodyTypes) =>
      await axiosCustomized
        .post<CommandKeyTypes>(`/plotFieldCommands/${plotFieldCommandId}/commandKeys`, {
          storyId,
          text,
          keyId,
        })
        .then((r) => r.data),
  });
}

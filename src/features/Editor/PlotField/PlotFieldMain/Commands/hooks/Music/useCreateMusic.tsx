import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateMusicTypes = {
  plotFieldCommandId: string;
};

export default function useCreateMusic({
  plotFieldCommandId,
}: CreateMusicTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/music`
      ),
  });
}

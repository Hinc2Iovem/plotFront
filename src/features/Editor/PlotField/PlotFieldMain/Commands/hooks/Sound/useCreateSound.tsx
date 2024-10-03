import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateSoundTypes = {
  plotFieldCommandId: string;
};

export default function useCreateSound({
  plotFieldCommandId,
}: CreateSoundTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/sounds`
      ),
  });
}

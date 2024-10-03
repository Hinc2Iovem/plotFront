import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateBackgroundTypes = {
  plotFieldCommandId: string;
};

export default function useCreateBackground({
  plotFieldCommandId,
}: CreateBackgroundTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/backgrounds`
      ),
  });
}

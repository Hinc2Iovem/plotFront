import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateCallTypes = {
  plotFieldCommandId: string;
};

export default function useCreateCall({ plotFieldCommandId }: CreateCallTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/calls`
      ),
  });
}

import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateAmbientTypes = {
  plotFieldCommandId: string;
};

export default function useCreateAmbient({
  plotFieldCommandId,
}: CreateAmbientTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/ambients`
      ),
  });
}

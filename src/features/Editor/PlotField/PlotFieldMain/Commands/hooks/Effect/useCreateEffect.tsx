import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateEffectTypes = {
  plotFieldCommandId: string;
};

export default function useCreateEffect({
  plotFieldCommandId,
}: CreateEffectTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/effects`
      ),
  });
}

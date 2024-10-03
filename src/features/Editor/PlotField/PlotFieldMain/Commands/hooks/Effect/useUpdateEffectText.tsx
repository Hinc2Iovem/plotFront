import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateEffectTextTypes = {
  effectId: string;
  effectName: string;
};

export default function useUpdateEffectText({
  effectId,
  effectName,
}: UpdateEffectTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(`/plotFieldCommands/effects/${effectId}`, {
        effectName,
      }),
  });
}

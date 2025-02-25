import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateStatTextTypes = {
  statId: string;
};

type UpdateStatBodyTypes = {
  characteristicId?: string;
  statValue?: number;
};

export default function useUpdateStat({ statId }: UpdateStatTextTypes) {
  return useMutation({
    mutationFn: async ({ characteristicId, statValue }: UpdateStatBodyTypes) =>
      await axiosCustomized.patch(`/plotFieldCommands/stats/${statId}`, {
        statValue,
        characteristicId,
      }),
  });
}

import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { EffectTypes } from "../../../../../types/StoryEditor/PlotField/Effect/EffectTypes";

type GetCommandEffectTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandChoice({ plotFieldCommandId }: GetCommandEffectTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "effect"],
    queryFn: async () =>
      await axiosCustomized.get<EffectTypes>(`/plotFieldCommands/${plotFieldCommandId}/effects`).then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}

import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { TranslationAchievementTypes } from "../../../../../../types/Additional/TranslationTypes";

type GetCommandAchievementTypes = {
  plotFieldCommandId: string;
};

export default function useGetTranslationAchievementViaPlotfieldCommandId({
  plotFieldCommandId,
}: GetCommandAchievementTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "achievement"],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationAchievementTypes>(`/plotFieldCommands/${plotFieldCommandId}/commandAchievements`)
        .then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}

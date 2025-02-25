import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CommandStatusTypes } from "../../../../../types/StoryEditor/PlotField/Status/StatusTypes";
import { getTranslationCharacterById } from "@/hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import { getCharacterById } from "@/hooks/Fetching/Character/useGetCharacterById";

type GetCommandStatusTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandStatus({ plotFieldCommandId }: GetCommandStatusTypes) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "status"],
    queryFn: async () => {
      const res = await axiosCustomized
        .get<CommandStatusTypes>(`/plotFieldCommands/${plotFieldCommandId}/status`)
        .then((r) => r.data);

      if (res?.characterId) {
        queryClient.prefetchQuery({
          queryKey: ["character", res.characterId],
          queryFn: () => getCharacterById({ characterId: res.characterId || "" }),
        });
        queryClient.prefetchQuery({
          queryKey: ["translation", "russian", "character", res.characterId],
          queryFn: () => getTranslationCharacterById({ characterId: res.characterId || "", language: "russian" }),
        });
      }

      return res;
    },
    enabled: !!plotFieldCommandId,
  });
}

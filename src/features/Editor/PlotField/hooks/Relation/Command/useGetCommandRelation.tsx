import { getCharacterById } from "@/hooks/Fetching/Character/useGetCharacterById";
import { getTranslationCharacterById } from "@/hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { RelationCommandTypes } from "@/types/StoryEditor/PlotField/Relation/RelationTypes";

type GetCommandRelationTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandRelation({ plotFieldCommandId }: GetCommandRelationTypes) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "relation"],
    queryFn: async () => {
      const res = await axiosCustomized
        .get<RelationCommandTypes>(`/plotFieldCommands/${plotFieldCommandId}/relationCommands`)
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

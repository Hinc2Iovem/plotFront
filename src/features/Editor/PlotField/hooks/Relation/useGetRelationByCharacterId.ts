import { axiosCustomized } from "@/api/axios";
import { RelationTypes } from "@/types/StoryEditor/PlotField/Relation/RelationTypes";
import { useQuery } from "@tanstack/react-query";

export default function useGetRelationByCharacterId({ characterId }: { characterId: string }) {
  return useQuery({
    queryKey: ["relation", "characters", characterId],
    queryFn: () => axiosCustomized.get<RelationTypes>(`/plotFieldCommands/relations/characters/${characterId}`),
    enabled: !!characterId,
  });
}

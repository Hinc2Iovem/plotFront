import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CommandWardrobeTypes } from "../../../../../types/StoryEditor/PlotField/Wardrobe/WardrobeTypes";

type GetCommandWardrobeTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandWardrobe({ plotFieldCommandId }: GetCommandWardrobeTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "wardrobe"],
    queryFn: async () =>
      await axiosCustomized
        .get<CommandWardrobeTypes>(`/plotFieldCommands/${plotFieldCommandId}/wardrobes`)
        .then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}

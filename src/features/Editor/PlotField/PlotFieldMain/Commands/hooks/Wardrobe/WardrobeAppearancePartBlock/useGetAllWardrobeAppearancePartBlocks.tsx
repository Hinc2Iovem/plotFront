import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { CommandWardrobeAppearanceTypeBlockTypes } from "../../../../../../../../types/StoryEditor/PlotField/Wardrobe/WardrobeTypes";

type GetAllWardrobeAppearancePartBlocksTypes = {
  commandWardrobeId: string;
};

export default function useGetAllWardrobeAppearancePartBlocks({
  commandWardrobeId,
}: GetAllWardrobeAppearancePartBlocksTypes) {
  return useQuery({
    queryKey: ["commandWardrobe", commandWardrobeId, "appearanceTypes"],
    queryFn: async () =>
      await axiosCustomized
        .get<CommandWardrobeAppearanceTypeBlockTypes[]>(
          `/plotFieldCommands/wardrobes/${commandWardrobeId}`
        )
        .then((r) => r.data),
    enabled: !!commandWardrobeId,
  });
}

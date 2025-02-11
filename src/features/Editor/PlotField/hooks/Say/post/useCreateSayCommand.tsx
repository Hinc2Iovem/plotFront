import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { CommandSayVariationTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";

type CreateSayCommandTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

type CreateSayCommandOnMutationTypes = {
  characterId?: string;
  type: CommandSayVariationTypes;
};

export default function useCreateSayCommand({ plotFieldCommandId, topologyBlockId }: CreateSayCommandTypes) {
  return useMutation({
    mutationFn: async ({ type, characterId }: CreateSayCommandOnMutationTypes) => {
      await axiosCustomized.post(`/says/${plotFieldCommandId}/topologyBlocks/${topologyBlockId}/translations`, {
        type,
        characterId,
      });
    },
  });
}

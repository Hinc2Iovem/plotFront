import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { CommandSayVariationTypes } from "../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";

type CreateSayCommandTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

type CreateSayCommandOnMutationTypes = {
  type: CommandSayVariationTypes;
};

export default function useCreateSayCommandBlank({
  plotFieldCommandId,
  topologyBlockId,
}: CreateSayCommandTypes) {
  return useMutation({
    mutationFn: async ({ type }: CreateSayCommandOnMutationTypes) => {
      await axiosCustomized.post(
        `/says/${plotFieldCommandId}/topologyBlocks/${topologyBlockId}/blank/translations`,
        {
          type,
        }
      );
    },
  });
}

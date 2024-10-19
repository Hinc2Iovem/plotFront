import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { CommandSayVariationTypes } from "../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";

type CreateSayCommandTypes = {
  plotFieldCommandId?: string;
  topologyBlockId: string;
};

type CreateSayCommandOnMutationTypes = {
  type: CommandSayVariationTypes;
  plotfieldCommandId?: string;
};

export default function useCreateSayCommandBlank({
  plotFieldCommandId,
  topologyBlockId,
}: CreateSayCommandTypes) {
  return useMutation({
    mutationFn: async ({
      type,
      plotfieldCommandId,
    }: CreateSayCommandOnMutationTypes) => {
      const commandId = plotFieldCommandId?.trim().length
        ? plotFieldCommandId
        : plotfieldCommandId;
      await axiosCustomized.post(
        `/says/${commandId}/topologyBlocks/${topologyBlockId}/blank/translations`,
        {
          type,
        }
      );
    },
  });
}

import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";

type CreatePlotFieldCommandInsideIfBlockTypes = {
  topologyBlockId: string;
  plotfieldCommandIfId: string;
  isElse?: boolean;
};

export default function useCreatePlotFieldCommandInsideIfBlock({
  plotfieldCommandIfId,
  topologyBlockId,
  isElse,
}: CreatePlotFieldCommandInsideIfBlockTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(`/plotField/topologyBlocks/${topologyBlockId}/commandIfs/${plotfieldCommandIfId}`, {
        isElse,
      }),
  });
}

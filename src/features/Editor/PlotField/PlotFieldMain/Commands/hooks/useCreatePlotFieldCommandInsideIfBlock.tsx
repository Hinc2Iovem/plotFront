import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type CreatePlotFieldCommandInsideIfBlockTypes = {
  topologyBlockId: string;
  commandIfId: string;
  isElse?: boolean;
};

export default function useCreatePlotFieldCommandInsideIfBlock({
  commandIfId,
  topologyBlockId,
  isElse,
}: CreatePlotFieldCommandInsideIfBlockTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotField/topologyBlocks/${topologyBlockId}/commandIfs/${commandIfId}`,
        {
          isElse,
        }
      ),
  });
}

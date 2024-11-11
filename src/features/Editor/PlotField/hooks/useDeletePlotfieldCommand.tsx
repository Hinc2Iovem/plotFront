import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";

type DeletePlotfieldCommandTypes = {
  plotfieldCommandId?: string;
};

type DeletePlotfieldCommandOnMutationTypes = {
  plotfieldCommandId?: string;
};

export default function useDeletePlotfieldCommand({ plotfieldCommandId }: DeletePlotfieldCommandTypes) {
  return useMutation({
    mutationFn: async ({ plotfieldCommandId: bodyPlotfieldCommandId }: DeletePlotfieldCommandOnMutationTypes) => {
      const currentPlotfieldCommandId = bodyPlotfieldCommandId?.trim().length
        ? bodyPlotfieldCommandId
        : plotfieldCommandId;
      await axiosCustomized.delete(`/plotField/${currentPlotfieldCommandId}/topologyBlocks`).then((r) => r.data);
    },
  });
}

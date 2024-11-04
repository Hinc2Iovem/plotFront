import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";

type DeletePlotfieldCommandTypes = {
  plotfieldCommandId: string;
};

export default function useDeletePlotfieldCommand({
  plotfieldCommandId,
}: DeletePlotfieldCommandTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized
        .delete(`/plotField/${plotfieldCommandId}/topologyBlocks`)
        .then((r) => r.data),
  });
}

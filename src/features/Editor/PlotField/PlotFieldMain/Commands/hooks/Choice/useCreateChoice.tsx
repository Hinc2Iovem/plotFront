import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateChoiceTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function useCreateChoice({
  plotFieldCommandId,
  topologyBlockId,
}: CreateChoiceTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/choices/${plotFieldCommandId}/topologyBlocks/${topologyBlockId}/translations`
      ),
  });
}

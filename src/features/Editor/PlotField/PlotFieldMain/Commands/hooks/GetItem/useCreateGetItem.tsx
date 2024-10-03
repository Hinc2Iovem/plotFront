import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateGetItemTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function useCreateGetItem({
  plotFieldCommandId,
  topologyBlockId,
}: CreateGetItemTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/getItems/${plotFieldCommandId}/topologyBlocks/${topologyBlockId}/translations`
      ),
  });
}

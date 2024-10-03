import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateWardrobeTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function useCreateWardrobe({
  plotFieldCommandId,
  topologyBlockId,
}: CreateWardrobeTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/commandWardrobes/${plotFieldCommandId}/topologyBlocks/${topologyBlockId}/translations`
      ),
  });
}

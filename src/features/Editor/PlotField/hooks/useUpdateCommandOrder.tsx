import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";

type UpdateCommandOrderTypes = {
  plotFieldCommandId: string;
  newOrder: number;
};

export default function useUpdateCommandOrder() {
  return useMutation({
    mutationFn: async ({
      newOrder,
      plotFieldCommandId,
    }: UpdateCommandOrderTypes) =>
      await axiosCustomized.patch(
        `/plotField/${plotFieldCommandId}/topologyBlocks/commandOrder`,
        {
          newOrder,
        }
      ),
  });
}

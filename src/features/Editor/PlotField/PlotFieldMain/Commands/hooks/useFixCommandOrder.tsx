import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type FixCommandOrderTypes = {
  plotFieldCommandId: string;
  commandOrder: number;
};

export default function useFixCommandOrder() {
  return useMutation({
    mutationFn: async ({
      commandOrder,
      plotFieldCommandId,
    }: FixCommandOrderTypes) =>
      await axiosCustomized.patch(`/plotField/${plotFieldCommandId}/fixOrder`, {
        commandOrder,
      }),
  });
}

import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type GetCommandIfTypes = {
  plotfieldCommandIfId: string;
};
type GetCommandIfOnMutationTypes = {
  plotFieldCommandId: string;
  newOrder: number;
};

export default function useUpdateOrderInsideCommandIf({ plotfieldCommandIfId }: GetCommandIfTypes) {
  return useMutation({
    mutationFn: async ({ newOrder, plotFieldCommandId }: GetCommandIfOnMutationTypes) => {
      await axiosCustomized.patch(`/plotFieldCommands/${plotFieldCommandId}/ifs/${plotfieldCommandIfId}/newOrder`, {
        newOrder,
      });
    },
  });
}

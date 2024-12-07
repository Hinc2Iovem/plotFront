import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type DeleteLogicalOperatorProps = {
  ifId: string;
};

type DeleteLogicalOperatorBody = {
  index: number;
};

export default function useDeleteLogicalOperator({ ifId }: DeleteLogicalOperatorProps) {
  return useMutation({
    mutationFn: async ({ index }: DeleteLogicalOperatorBody) =>
      await axiosCustomized.delete(`/ifs/${ifId}/logicalOperator?index=${index}`),
  });
}

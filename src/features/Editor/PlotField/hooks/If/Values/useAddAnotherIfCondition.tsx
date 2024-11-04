import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type AddAnotherIfConditionTypes = {
  ifId: string;
};

export default function useAddAnotherIfCondition({
  ifId,
}: AddAnotherIfConditionTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(`/plotFieldCommands/ifs/${ifId}/ifValues`),
  });
}

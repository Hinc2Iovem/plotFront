import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";

type UpdateConditionKeyProps = {
  conditionBlockKeyId: string;
};

type UpdateConditionKeyBody = {
  keyId?: string;
};

export default function useUpdateConditionKey({ conditionBlockKeyId }: UpdateConditionKeyProps) {
  return useMutation({
    mutationFn: async ({ keyId }: UpdateConditionKeyBody) =>
      await axiosCustomized.patch(
        `/commandConditions/conditionBlocks/conditionKey/${conditionBlockKeyId}/keys/${keyId}`
      ),
  });
}

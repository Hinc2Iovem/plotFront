import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateConditionTypes = {
  plotFieldCommandId: string;
};

export default function useCreateCondition({
  plotFieldCommandId,
}: CreateConditionTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/conditions`
      ),
  });
}

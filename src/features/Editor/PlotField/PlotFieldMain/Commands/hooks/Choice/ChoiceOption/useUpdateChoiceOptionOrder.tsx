import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";

type UpdateChoiceOptionOrders = {
  choiceOptionId: string;
  choiceId: string;
};

type UpdateChoiceOptionOrderOnMutationTypes = {
  optionOrder: number;
};

export default function useUpdateChoiceOptionOrder({
  choiceOptionId,
  choiceId,
}: UpdateChoiceOptionOrders) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      optionOrder,
    }: UpdateChoiceOptionOrderOnMutationTypes) =>
      await axiosCustomized.patch(
        `/plotFieldCommands/choices/${choiceId}/options/${choiceOptionId}/optionOrder`,
        {
          optionOrder,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["choiceOption", choiceOptionId],
        exact: true,
        type: "active",
      });
    },
  });
}

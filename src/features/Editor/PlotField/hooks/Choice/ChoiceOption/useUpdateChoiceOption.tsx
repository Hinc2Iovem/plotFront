import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type UpdateChoiceOptionTypes = {
  choiceOptionId: string;
};

type UpdateChoiceOptionOnMutationTypes = {
  option?: string;
  priceAmethysts?: number;
  amountOfPoints?: number;
  characterCharacteristicId?: string;
  characterId?: string;
};

export default function useUpdateChoiceOption({ choiceOptionId }: UpdateChoiceOptionTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      amountOfPoints,
      characterCharacteristicId,
      characterId,
      option,
      priceAmethysts,
    }: UpdateChoiceOptionOnMutationTypes) =>
      await axiosCustomized.patch(`/plotFieldCommands/choices/options/${choiceOptionId}`, {
        option,
        priceAmethysts,
        characterId,
        amountOfPoints,
        characterCharacteristicId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["option", "relationship", choiceOptionId],
      });
    },
  });
}

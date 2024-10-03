import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateChoiceTextTypes = {
  choiceId: string;
};

type UpdateChoiceOnMutationTypes = {
  isAuthor?: boolean;
};

export default function useUpdateChoiceIsAuthor({
  choiceId,
}: UpdateChoiceTextTypes) {
  return useMutation({
    mutationFn: async ({ isAuthor }: UpdateChoiceOnMutationTypes) => {
      await axiosCustomized.patch(
        `/plotFieldCommands/choices/${choiceId}/isAuthor`,
        {
          isAuthor,
        }
      );
    },
  });
}

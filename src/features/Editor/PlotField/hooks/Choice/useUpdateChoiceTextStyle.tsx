import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { TextStyleTypes } from "../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";

type UpdateChoiceTextStyleTypes = {
  choiceId: string;
};

type UpdateChoiceTextStyleOnMutationTypes = {
  textStyle: TextStyleTypes;
};

export default function useUpdateChoiceTextStyle({
  choiceId,
}: UpdateChoiceTextStyleTypes) {
  return useMutation({
    mutationFn: async ({ textStyle }: UpdateChoiceTextStyleOnMutationTypes) =>
      await axiosCustomized.patch(
        `/plotFieldCommands/choices/${choiceId}/textStyle`,
        {
          textStyle,
        }
      ),
  });
}

import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { SexualOrientationTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/SEXUAL_ORIENTATION_TYPES";

type UpdateChoiceOptionSexualOrientationTypes = {
  choiceOptionId: string;
};

type UpdateChoiceOptionSexualOrientationOnMutationTypes = {
  sexualOrientationType: SexualOrientationTypes;
};

export default function useUpdateChoiceOptionSexualOrientation({
  choiceOptionId,
}: UpdateChoiceOptionSexualOrientationTypes) {
  return useMutation({
    mutationFn: async ({
      sexualOrientationType,
    }: UpdateChoiceOptionSexualOrientationOnMutationTypes) =>
      await axiosCustomized.patch(
        `/plotFieldCommands/choices/options/${choiceOptionId}/sexualOrientation`,
        {
          sexualOrientationType,
        }
      ),
  });
}

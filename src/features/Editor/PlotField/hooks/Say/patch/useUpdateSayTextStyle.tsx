import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { TextStyleTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";

type UpdateSayTextStyleTypes = {
  sayId: string;
};

type UpdateSayTextStyleOnMutationTypes = {
  textStyle: TextStyleTypes;
};

export default function useUpdateSayTextStyle({ sayId }: UpdateSayTextStyleTypes) {
  return useMutation({
    mutationFn: async ({ textStyle }: UpdateSayTextStyleOnMutationTypes) =>
      await axiosCustomized.patch(`/plotFieldCommands/say/${sayId}/textStyle`, {
        textStyle,
      }),
  });
}

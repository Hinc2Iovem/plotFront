import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { ConditionValueVariationType } from "../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type AddNewIfVariationProps = {
  ifId: string;
};

type AddNewIfVariationBody = {
  _id: string;
  type: ConditionValueVariationType;
};

export default function useAddNewIfVariation({ ifId }: AddNewIfVariationProps) {
  return useMutation({
    mutationFn: async ({ _id, type }: AddNewIfVariationBody) =>
      await axiosCustomized.post(`/ifs/${ifId}/variations`, {
        _id,
        type,
      }),
  });
}

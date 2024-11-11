import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import {
  ConditionAppearanceTypes,
  ConditionCharacteristicTypes,
  ConditionCharacterTypes,
  ConditionKeyTypes,
  ConditionLanguageTypes,
  ConditionRandomTypes,
  ConditionRetryTypes,
  ConditionStatusTypes,
} from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type GetAllConditionBlockVariationsByConditionBlockIdProps = {
  conditionBlockId?: string;
};

export type ConditionVariationResponseTypes = {
  key: ConditionKeyTypes[];
  appearance: ConditionAppearanceTypes[];
  character: ConditionCharacterTypes[];
  characteristic: ConditionCharacteristicTypes[];
  language: ConditionLanguageTypes[];
  random: ConditionRandomTypes[];
  retry: ConditionRetryTypes[];
  status: ConditionStatusTypes[];
};

export default function useGetAllConditionBlockVariationsByConditionBlockId({
  conditionBlockId,
}: GetAllConditionBlockVariationsByConditionBlockIdProps) {
  return useQuery({
    queryKey: ["conditionBlock", conditionBlockId, "variations"],
    queryFn: async () =>
      await axiosCustomized
        .get<ConditionVariationResponseTypes>(`/commandConditions/conditionBlocks/${conditionBlockId}/variations`)
        .then((r) => r.data),
  });
}

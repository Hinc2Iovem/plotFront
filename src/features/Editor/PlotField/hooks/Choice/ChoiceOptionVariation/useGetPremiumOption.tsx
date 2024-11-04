import { useQuery } from "@tanstack/react-query";
import { OptionPremiumTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { axiosCustomized } from "../../../../../../api/axios";

type GetPremiumOptionTypes = {
  plotFieldCommandChoiceOptionId: string;
};

export default function useGetPremiumOption({
  plotFieldCommandChoiceOptionId,
}: GetPremiumOptionTypes) {
  return useQuery({
    queryKey: ["option", "premium", plotFieldCommandChoiceOptionId],
    queryFn: async () =>
      await axiosCustomized
        .get<OptionPremiumTypes>(
          `/plotFieldCommands/choice/options/${plotFieldCommandChoiceOptionId}/choiceOptionPremium`
        )
        .then((r) => r.data),
    enabled: !!plotFieldCommandChoiceOptionId,
  });
}

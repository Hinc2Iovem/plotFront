import { useQuery } from "@tanstack/react-query";
import { OptionCharacteristicTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { axiosCustomized } from "../../../../../../api/axios";

type GetCharacteristicOptionTypes = {
  plotFieldCommandChoiceOptionId: string;
};

export default function useGetCharacteristicOption({
  plotFieldCommandChoiceOptionId,
}: GetCharacteristicOptionTypes) {
  return useQuery({
    queryKey: ["option", "characteristic", plotFieldCommandChoiceOptionId],
    queryFn: async () =>
      await axiosCustomized
        .get<OptionCharacteristicTypes>(
          `/plotFieldCommands/choice/options/${plotFieldCommandChoiceOptionId}/choiceOptionCharacteristic`
        )
        .then((r) => r.data),
    enabled: !!plotFieldCommandChoiceOptionId,
  });
}

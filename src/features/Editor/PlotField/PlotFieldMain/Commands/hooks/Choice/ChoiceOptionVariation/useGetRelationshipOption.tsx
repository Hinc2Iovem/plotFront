import { useQuery } from "@tanstack/react-query";
import { OptionRelationshipTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { axiosCustomized } from "../../../../../../../../api/axios";

type GetRelationshipOptionTypes = {
  plotFieldCommandChoiceOptionId: string;
};

export default function useGetRelationshipOption({
  plotFieldCommandChoiceOptionId,
}: GetRelationshipOptionTypes) {
  return useQuery({
    queryKey: ["option", "relationship", plotFieldCommandChoiceOptionId],
    queryFn: async () =>
      await axiosCustomized
        .get<OptionRelationshipTypes>(
          `/plotFieldCommands/choice/options/${plotFieldCommandChoiceOptionId}/choiceOptionRelationship`
        )
        .then((r) => r.data),
    enabled: !!plotFieldCommandChoiceOptionId,
  });
}

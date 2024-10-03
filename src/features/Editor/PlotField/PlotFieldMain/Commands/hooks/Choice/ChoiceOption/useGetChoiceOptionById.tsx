import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { ChoiceOptionTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";

export default function useGetChoiceOptionById({
  choiceOptionId,
}: {
  choiceOptionId: string;
}) {
  return useQuery({
    queryKey: ["choiceOption", choiceOptionId],
    queryFn: async () =>
      await axiosCustomized
        .get<ChoiceOptionTypes>(
          `/plotFieldCommands/choices/options/${choiceOptionId}`
        )
        .then((r) => r.data),
    enabled: !!choiceOptionId,
  });
}

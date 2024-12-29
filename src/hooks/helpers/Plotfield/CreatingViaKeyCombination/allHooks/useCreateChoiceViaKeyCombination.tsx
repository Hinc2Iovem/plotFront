import useCreateChoice from "../../../../../features/Editor/PlotField/hooks/Choice/useCreateChoice";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateChoiceViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateChoiceViaKeyCombination({ topologyBlockId }: CreateChoiceViaKeyCombinationTypes) {
  const createChoice = useCreateChoice({ topologyBlockId });

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createChoice,
    firstEngLetter: "c",
    secondEngLetter: "h",
    firstRusLetter: "с",
    secondRusLetter: "р",
    topologyBlockId,
    commandName: "choice",
  });
}

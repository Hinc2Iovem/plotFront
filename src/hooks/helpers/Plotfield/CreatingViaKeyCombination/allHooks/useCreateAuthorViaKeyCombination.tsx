import useCreateSayCommandBlank, {
  CreateSayCommandOnMutationTypes,
} from "../../../../../features/Editor/PlotField/hooks/Say/post/useCreateSayCommandBlank";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateAuthorViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateAuthorViaKeyCombination({ topologyBlockId }: CreateAuthorViaKeyCombinationTypes) {
  const createAuthor = useCreateSayCommandBlank({ topologyBlockId });

  useHandleCreatingViaKeyCombinationProcess<CreateSayCommandOnMutationTypes>({
    createCommand: createAuthor,
    firstEngLetter: "a",
    secondEngLetter: "u",
    firstRusLetter: "ф",
    secondRusLetter: "г",
    topologyBlockId,
    sayType: "author",
    createCommandData: { type: "author" },
    commandName: "say",
  });
}

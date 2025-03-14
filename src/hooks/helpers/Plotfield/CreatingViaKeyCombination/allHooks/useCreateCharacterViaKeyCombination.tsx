import useCreateSayCommandBlank, {
  CreateSayCommandOnMutationTypes,
} from "../../../../../features/Editor/PlotField/hooks/Say/post/useCreateSayCommandBlank";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateCharacterViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateCharacterViaKeyCombination({
  topologyBlockId,
}: CreateCharacterViaKeyCombinationTypes) {
  const createCharacter = useCreateSayCommandBlank({ topologyBlockId });

  useHandleCreatingViaKeyCombinationProcess<CreateSayCommandOnMutationTypes>({
    createCommand: createCharacter,
    firstEngLetter: "c",
    secondEngLetter: "r",
    firstRusLetter: "с",
    secondRusLetter: "к",
    topologyBlockId,
    sayType: "character",
    createCommandData: { type: "character" },
    commandName: "say",
  });
}

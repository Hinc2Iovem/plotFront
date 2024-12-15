import useCreateSayCommandBlank, {
  CreateSayCommandOnMutationTypes,
} from "../../../../../features/Editor/PlotField/hooks/Say/useCreateSayCommandBlank";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateHintViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateHintViaKeyCombination({ topologyBlockId }: CreateHintViaKeyCombinationTypes) {
  const createHint = useCreateSayCommandBlank({ topologyBlockId });

  useHandleCreatingViaKeyCombinationProcess<CreateSayCommandOnMutationTypes>({
    createCommand: createHint,
    firstEngLetter: "h",
    secondEngLetter: "i",
    firstRusLetter: "р",
    secondRusLetter: "ш",
    topologyBlockId,
    sayType: "hint",
    createCommandData: { type: "hint" },
  });
}

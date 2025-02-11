import useCreateSayCommandBlank, {
  CreateSayCommandOnMutationTypes,
} from "../../../../../features/Editor/PlotField/hooks/Say/post/useCreateSayCommandBlank";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateNotifyViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateNotifyViaKeyCombination({ topologyBlockId }: CreateNotifyViaKeyCombinationTypes) {
  const createNotify = useCreateSayCommandBlank({ topologyBlockId });

  useHandleCreatingViaKeyCombinationProcess<CreateSayCommandOnMutationTypes>({
    createCommand: createNotify,
    firstEngLetter: "n",
    secondEngLetter: "o",
    firstRusLetter: "т",
    secondRusLetter: "щ",
    topologyBlockId,
    sayType: "notify",
    createCommandData: { type: "notify" },
    commandName: "say",
  });
}

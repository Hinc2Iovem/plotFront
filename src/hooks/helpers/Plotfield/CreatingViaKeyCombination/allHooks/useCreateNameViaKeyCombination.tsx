import useCreateName from "../../../../../features/Editor/PlotField/hooks/Name/useCreateName";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateNameViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateNameViaKeyCombination({ topologyBlockId }: CreateNameViaKeyCombinationTypes) {
  const createName = useCreateName({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createName,
    firstEngLetter: "n",
    secondEngLetter: "a",
    firstRusLetter: "т",
    secondRusLetter: "ф",
    topologyBlockId,
    commandName: "name",
  });
}

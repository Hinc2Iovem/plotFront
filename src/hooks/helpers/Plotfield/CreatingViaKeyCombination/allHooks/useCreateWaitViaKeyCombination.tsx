import useCreateWait from "../../../../../features/Editor/PlotField/hooks/Wait/useCreateWait";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateWaitViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateWaitViaKeyCombination({ topologyBlockId }: CreateWaitViaKeyCombinationTypes) {
  const createWait = useCreateWait({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createWait,
    firstEngLetter: "w",
    secondEngLetter: "a",
    firstRusLetter: "ц",
    secondRusLetter: "ф",
    topologyBlockId,
  });
}

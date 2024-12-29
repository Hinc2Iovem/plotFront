import useCreateSuit from "../../../../../features/Editor/PlotField/hooks/Suit/useCreateSuit";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateSuitViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateSuitViaKeyCombination({ topologyBlockId }: CreateSuitViaKeyCombinationTypes) {
  const createSuit = useCreateSuit({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createSuit,
    firstEngLetter: "s",
    secondEngLetter: "u",
    firstRusLetter: "ы",
    secondRusLetter: "г",
    topologyBlockId,
    commandName: "suit",
  });
}

import useCreateMove from "../../../../../features/Editor/PlotField/hooks/Move/useCreateMove";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateMoveViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateMoveViaKeyCombination({ topologyBlockId }: CreateMoveViaKeyCombinationTypes) {
  const createMove = useCreateMove({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createMove,
    firstEngLetter: "m",
    secondEngLetter: "o",
    firstRusLetter: "ь",
    secondRusLetter: "щ",
    topologyBlockId,
  });
}

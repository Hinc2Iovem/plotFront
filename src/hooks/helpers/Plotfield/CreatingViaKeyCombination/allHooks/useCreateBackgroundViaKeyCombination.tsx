import useCreateBackground from "../../../../../features/Editor/PlotField/hooks/Background/useCreateBackground";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateBackgroundViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateBackgroundViaKeyCombination({
  topologyBlockId,
}: CreateBackgroundViaKeyCombinationTypes) {
  const createBackground = useCreateBackground({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createBackground,
    firstEngLetter: "b",
    secondEngLetter: "a",
    firstRusLetter: "ф",
    secondRusLetter: "и",
    topologyBlockId,
    commandName: "background",
  });
}

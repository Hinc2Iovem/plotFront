import useCreateAmbient from "../../../../../features/Editor/PlotField/hooks/Ambient/useCreateAmbient";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateAmbientViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateAmbientViaKeyCombination({ topologyBlockId }: CreateAmbientViaKeyCombinationTypes) {
  const createAmbient = useCreateAmbient({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createAmbient,
    firstEngLetter: "a",
    secondEngLetter: "m",
    firstRusLetter: "ф",
    secondRusLetter: "ь",
    topologyBlockId,
  });
}

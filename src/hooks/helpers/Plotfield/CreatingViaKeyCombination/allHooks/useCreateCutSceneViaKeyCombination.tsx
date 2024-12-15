import useCreateCutScene from "../../../../../features/Editor/PlotField/hooks/CutScene/useCreateCutScene";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateCutSceneViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateCutSceneViaKeyCombination({ topologyBlockId }: CreateCutSceneViaKeyCombinationTypes) {
  const createCutScene = useCreateCutScene({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createCutScene,
    firstEngLetter: "c",
    secondEngLetter: "u",
    firstRusLetter: "с",
    secondRusLetter: "г",
    topologyBlockId,
  });
}

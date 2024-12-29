import useCreateEffect from "../../../../../features/Editor/PlotField/hooks/Effect/useCreateEffect";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateEffectViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateEffectViaKeyCombination({ topologyBlockId }: CreateEffectViaKeyCombinationTypes) {
  const createEffect = useCreateEffect({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createEffect,
    firstEngLetter: "e",
    secondEngLetter: "f",
    firstRusLetter: "у",
    secondRusLetter: "а",
    topologyBlockId,
    commandName: "effect",
  });
}

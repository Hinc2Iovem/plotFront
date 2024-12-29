import useCreateCommandSound from "../../../../../features/Editor/PlotField/hooks/Sound/useCreateCommandSound";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateSoundViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateSoundViaKeyCombination({ topologyBlockId }: CreateSoundViaKeyCombinationTypes) {
  const createSound = useCreateCommandSound({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createSound,
    firstEngLetter: "s",
    secondEngLetter: "o",
    firstRusLetter: "ы",
    secondRusLetter: "щ",
    topologyBlockId,
    commandName: "sound",
  });
}

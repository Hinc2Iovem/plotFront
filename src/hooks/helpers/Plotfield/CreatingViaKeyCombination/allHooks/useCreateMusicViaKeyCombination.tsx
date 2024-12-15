import useCreateCommandMusic from "../../../../../features/Editor/PlotField/hooks/Music/useCreateCommandMusic";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateMusicViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateMusicViaKeyCombination({ topologyBlockId }: CreateMusicViaKeyCombinationTypes) {
  const createMusic = useCreateCommandMusic({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createMusic,
    firstEngLetter: "m",
    secondEngLetter: "u",
    firstRusLetter: "ь",
    secondRusLetter: "г",
    topologyBlockId,
  });
}

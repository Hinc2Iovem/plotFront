import useCreateWardrobe from "../../../../../features/Editor/PlotField/hooks/Wardrobe/useCreateWardrobe";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateWardrobeViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateWardrobeViaKeyCombination({ topologyBlockId }: CreateWardrobeViaKeyCombinationTypes) {
  const createWardrobe = useCreateWardrobe({ topologyBlockId });

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createWardrobe,
    firstEngLetter: "w",
    secondEngLetter: "d",
    firstRusLetter: "ц",
    secondRusLetter: "в",
    topologyBlockId,
    commandName: "wardrobe",
  });
}

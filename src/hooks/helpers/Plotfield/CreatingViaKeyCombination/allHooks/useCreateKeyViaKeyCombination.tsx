import { useParams } from "react-router-dom";
import useCreateCommandKey from "../../../../../features/Editor/PlotField/hooks/Key/useCreateCommandKey";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateKeyViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateKeyViaKeyCombination({ topologyBlockId }: CreateKeyViaKeyCombinationTypes) {
  const { storyId } = useParams();

  const createKey = useCreateCommandKey({ storyId: storyId || "" });

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createKey,
    firstEngLetter: "k",
    secondEngLetter: "e",
    firstRusLetter: "л",
    secondRusLetter: "у",
    topologyBlockId,
    commandName: "key",
  });
}

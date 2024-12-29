import useCreateCall from "../../../../../features/Editor/PlotField/hooks/Call/useCreateCall";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateCallViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateCallViaKeyCombination({ topologyBlockId }: CreateCallViaKeyCombinationTypes) {
  const createCall = useCreateCall({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createCall,
    firstEngLetter: "c",
    secondEngLetter: "l",
    firstRusLetter: "с",
    secondRusLetter: "д",
    topologyBlockId,
    commandName: "call",
  });
}

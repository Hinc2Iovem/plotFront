import useCreateGetItem from "../../../../../features/Editor/PlotField/hooks/GetItem/useCreateGetItem";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateGetItemViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateGetItemViaKeyCombination({ topologyBlockId }: CreateGetItemViaKeyCombinationTypes) {
  const createGetItem = useCreateGetItem({ topologyBlockId });

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createGetItem,
    firstEngLetter: "e",
    secondEngLetter: "g",
    firstRusLetter: "у",
    secondRusLetter: "п",
    topologyBlockId,
    commandName: "getitem",
  });
}

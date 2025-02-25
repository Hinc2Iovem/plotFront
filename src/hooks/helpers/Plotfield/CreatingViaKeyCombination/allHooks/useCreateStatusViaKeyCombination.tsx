import useCreateCommandStatus from "@/features/Editor/PlotField/hooks/Status/useCreateCommandStatus";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateStatViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateStatusViaKeyCombination({ topologyBlockId }: CreateStatViaKeyCombinationTypes) {
  const createStat = useCreateCommandStatus({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createStat,
    firstEngLetter: "s",
    secondEngLetter: "a",
    firstRusLetter: "ы",
    secondRusLetter: "ф",
    topologyBlockId,
    commandName: "status",
  });
}

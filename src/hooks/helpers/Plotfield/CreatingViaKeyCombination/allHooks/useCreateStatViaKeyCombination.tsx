import useCreateStat from "../../../../../features/Editor/PlotField/hooks/Stat/useCreateStat";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateStatViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateStatViaKeyCombination({ topologyBlockId }: CreateStatViaKeyCombinationTypes) {
  const createStat = useCreateStat({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createStat,
    firstEngLetter: "s",
    secondEngLetter: "t",
    firstRusLetter: "ы",
    secondRusLetter: "е",
    topologyBlockId,
    commandName: "stat",
  });
}

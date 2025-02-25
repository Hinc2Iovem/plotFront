import useCreateCommandRelation from "@/features/Editor/PlotField/hooks/Relation/Command/useCreateCommandRelation";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateRelationViaRelationCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateRelationViaKeyCombination({
  topologyBlockId,
}: CreateRelationViaRelationCombinationTypes) {
  const createRelation = useCreateCommandRelation({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createRelation,
    firstEngLetter: "r",
    secondEngLetter: "e",
    firstRusLetter: "к",
    secondRusLetter: "у",
    topologyBlockId,
    commandName: "relation",
  });
}

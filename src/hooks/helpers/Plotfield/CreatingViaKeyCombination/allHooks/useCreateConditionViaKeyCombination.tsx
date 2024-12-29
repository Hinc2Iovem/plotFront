import { useParams } from "react-router-dom";
import useCreateCondition, {
  CreateConditionOnMutation,
} from "../../../../../features/Editor/PlotField/hooks/Condition/useCreateCondition";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import { makeTopologyBlockName } from "../../../../../features/Editor/Flowchart/utils/makeTopologyBlockName";
import useNavigation from "../../../../../features/Editor/Context/Navigation/NavigationContext";

type CreateConditionViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateConditionViaKeyCombination({
  topologyBlockId,
}: CreateConditionViaKeyCombinationTypes) {
  // TODO not here but when I create choiceOption or conditionBlock I need to updateAmountOfChildBlocks inside useTopologyBlocks()
  const { episodeId } = useParams();
  const createCondition = useCreateCondition({ episodeId: episodeId || "" });

  const { currentTopologyBlock } = useNavigation();

  const conditionBlockId = generateMongoObjectId();
  const targetBlockId = generateMongoObjectId();
  useHandleCreatingViaKeyCombinationProcess<CreateConditionOnMutation>({
    createCommand: createCondition,
    firstEngLetter: "c",
    secondEngLetter: "o",
    firstRusLetter: "с",
    secondRusLetter: "щ",
    topologyBlockId,
    createCommandData: {
      conditionBlockId,
      coordinatesX: currentTopologyBlock?.coordinatesX,
      coordinatesY: currentTopologyBlock?.coordinatesY,
      sourceBlockName: makeTopologyBlockName({
        name: currentTopologyBlock?.name || "",
        amountOfOptions: currentTopologyBlock?.topologyBlockInfo?.amountOfChildBlocks || 1,
      }),
      targetBlockId,
      topologyBlockId,
    },
    commandName: "condition",
  });
}

import { useRef } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import PlotfieldButton from "../../../../../../ui/Buttons/PlotfieldButton";
import { makeTopologyBlockName } from "../../../../Flowchart/utils/makeTopologyBlockName";
import useAddAnotherConditionBlock from "../../../hooks/Condition/ConditionBlock/useAddAnotherConditionBlock";
import useConditionBlocks from "./Context/ConditionContext";
import useNavigation from "../../../../Context/Navigation/NavigationContext";

type CreateConditionValueTypeModalTypes = {
  setShowCreateValueType: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateValueType: boolean;
  commandConditionId: string;
  plotfieldCommandId: string;
};

export default function CreateConditionValueTypeModal({
  setShowCreateValueType,
  showCreateValueType,
  commandConditionId,
  plotfieldCommandId,
}: CreateConditionValueTypeModalTypes) {
  const { episodeId } = useParams();
  const { addConditionBlock, getAmountOfOnlyIfConditionBlocks } = useConditionBlocks();
  const { currentTopologyBlock, updateAmountOfChildBlocks } = useNavigation();
  const modalRef = useRef<HTMLDivElement>(null);

  const createCommandinsideCondition = useAddAnotherConditionBlock({
    commandConditionId,
    episodeId: episodeId || "",
  });
  const handleConditionValueCreation = () => {
    const targetBlockId = generateMongoObjectId();
    const conditionBlockId = generateMongoObjectId();

    updateAmountOfChildBlocks("add");

    addConditionBlock({
      conditionBlock: {
        conditionBlockId,
        conditionBlockVariations: [],
        logicalOperators: "",
        isElse: false,
        orderOfExecution:
          getAmountOfOnlyIfConditionBlocks({ plotfieldCommandId }) < 1
            ? 1
            : getAmountOfOnlyIfConditionBlocks({ plotfieldCommandId }) + 1,
        targetBlockId,
        topologyBlockName: makeTopologyBlockName({
          name: currentTopologyBlock?.name || "",
          amountOfOptions: currentTopologyBlock?.topologyBlockInfo?.amountOfChildBlocks || 1,
        }),
      },
      plotfieldCommandId,
    });

    createCommandinsideCondition.mutate({
      coordinatesX: currentTopologyBlock?.coordinatesX,
      coordinatesY: currentTopologyBlock?.coordinatesY,
      sourceBlockName: makeTopologyBlockName({
        name: currentTopologyBlock?.name || "",
        amountOfOptions: currentTopologyBlock?.topologyBlockInfo?.amountOfChildBlocks || 1,
      }),
      targetBlockId,
      topologyBlockId: currentTopologyBlock?._id,
      conditionBlockId,
      orderOfExecution:
        getAmountOfOnlyIfConditionBlocks({ plotfieldCommandId }) < 1
          ? 1
          : getAmountOfOnlyIfConditionBlocks({ plotfieldCommandId }),
    });
    setShowCreateValueType(false);
  };

  useOutOfModal({
    modalRef,
    setShowModal: setShowCreateValueType,
    showModal: showCreateValueType,
  });
  return (
    <aside
      ref={modalRef}
      className={`absolute right-[0rem] top-[3.5rem] bg-secondary rounded-md shadow-sm ${
        showCreateValueType ? "" : "hidden"
      } w-fit flex flex-col gap-[.5rem] p-[.5rem] z-[10]`}
    >
      <PlotfieldButton onClick={() => handleConditionValueCreation()}>Создать Блок</PlotfieldButton>
    </aside>
  );
}

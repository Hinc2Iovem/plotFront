import { useRef } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import PlotfieldButton from "../../../../../shared/Buttons/PlotfieldButton";
import useTopologyBlocks from "../../../../Flowchart/Context/TopologyBlockContext";
import { makeTopologyBlockName } from "../../../../Flowchart/utils/makeTopologyBlockName";
import useAddAnotherConditionBlock from "../../../hooks/Condition/ConditionBlock/useAddAnotherConditionBlock";
import useConditionBlocks from "./Context/ConditionContext";

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
  const { getTopologyBlock, updateAmountOfChildBlocks } = useTopologyBlocks();
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
          name: getTopologyBlock()?.name || "",
          amountOfOptions: getTopologyBlock()?.topologyBlockInfo?.amountOfChildBlocks || 1,
        }),
      },
      plotfieldCommandId,
    });

    createCommandinsideCondition.mutate({
      coordinatesX: getTopologyBlock().coordinatesX,
      coordinatesY: getTopologyBlock().coordinatesY,
      sourceBlockName: makeTopologyBlockName({
        name: getTopologyBlock()?.name || "",
        amountOfOptions: getTopologyBlock()?.topologyBlockInfo?.amountOfChildBlocks || 1,
      }),
      targetBlockId,
      topologyBlockId: getTopologyBlock()._id,
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

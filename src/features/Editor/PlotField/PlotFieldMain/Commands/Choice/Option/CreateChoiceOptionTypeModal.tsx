import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import {
  ChoiceOptionVariations,
  ChoiceOptionVariationsTypes,
} from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { generateMongoObjectId } from "../../../../../../../utils/generateMongoObjectId";
import useCreateChoiceOption from "../../hooks/Choice/ChoiceOption/useCreateChoiceOption";
import useChoiceOptions from "../Context/ChoiceContext";
import useTopologyBlocks from "../../../../../Flowchart/Context/TopologyBlockContext";
import { makeTopologyBlockName } from "../../../../../Flowchart/utils/makeTopologyBlockName";

type CreateChoiceOptionTypeModalTypes = {
  plotFieldCommandId: string;
  plotFieldCommandChoiceId: string;
  topologyBlockId: string;
  showCreateChoiceOptionModal: boolean;
  setShowCreateChoiceOptionModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateChoiceOptionTypeModal({
  plotFieldCommandChoiceId,
  plotFieldCommandId,
  showCreateChoiceOptionModal,
  topologyBlockId,
  setShowCreateChoiceOptionModal,
}: CreateChoiceOptionTypeModalTypes) {
  const { getTopologyBlock, updateAmountOfChildBlocks } = useTopologyBlocks();
  const { addChoiceOption } = useChoiceOptions();
  const { episodeId } = useParams();
  const modalRef = useRef<HTMLDivElement>(null);

  const createChoiceOption = useCreateChoiceOption({
    plotFieldCommandChoiceId,
    plotFieldCommandId,
    episodeId: episodeId || "",
    topologyBlockId,
    coordinatesX: getTopologyBlock()?.coordinatesX,
    coordinatesY: getTopologyBlock()?.coordinatesY,
    sourceBlockName: makeTopologyBlockName({
      name: getTopologyBlock()?.name || "",
      amountOfOptions:
        getTopologyBlock()?.topologyBlockInfo?.amountOfChildBlocks || 1,
    }),
  });

  const handleCreatingChoiceOption = (cov: ChoiceOptionVariationsTypes) => {
    const choiceOptionId = generateMongoObjectId();
    const targetBlockId = generateMongoObjectId();
    setShowCreateChoiceOptionModal(false);
    updateAmountOfChildBlocks("add");
    addChoiceOption({
      choiceId: plotFieldCommandChoiceId,
      choiceOption: {
        choiceOptionId,
        optionText: "",
        optionType: cov,
        topologyBlockId: targetBlockId,
        optionOrder: null,
        topologyBlockName: makeTopologyBlockName({
          name: getTopologyBlock()?.name || "",
          amountOfOptions:
            getTopologyBlock()?.topologyBlockInfo?.amountOfChildBlocks || 1,
        }),
      },
    });
    createChoiceOption.mutate({ type: cov, choiceOptionId, targetBlockId });
  };

  useEffect(() => {
    if (createChoiceOption.isError) {
      updateAmountOfChildBlocks("minus");
    }
  }, [createChoiceOption]);

  useOutOfModal({
    modalRef,
    showModal: showCreateChoiceOptionModal,
    setShowModal: setShowCreateChoiceOptionModal,
  });
  return (
    <aside
      ref={modalRef}
      className={`${
        showCreateChoiceOptionModal ? "" : "hidden"
      } absolute right-0 z-[10] flex flex-col min-w-fit w-full rounded-md shadow-md p-[.5rem] bg-white`}
    >
      {ChoiceOptionVariations.map((cov) => (
        <button
          key={cov}
          onClick={() => handleCreatingChoiceOption(cov)}
          className={`hover:bg-primary-light-blue outline-gray-300 hover:text-white transition-all text-[1.4rem] whitespace-nowrap text-gray-700 px-[1rem] py-[.5rem] rounded-md`}
        >
          {cov}
        </button>
      ))}
    </aside>
  );
}

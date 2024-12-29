import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import {
  ChoiceOptionVariations,
  ChoiceOptionVariationsTypes,
} from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { generateMongoObjectId } from "../../../../../../../utils/generateMongoObjectId";
import useCreateChoiceOption from "../../../../hooks/Choice/ChoiceOption/useCreateChoiceOption";
import useChoiceOptions from "../Context/ChoiceContext";
import { makeTopologyBlockName } from "../../../../../Flowchart/utils/makeTopologyBlockName";
import useNavigation from "../../../../../Context/Navigation/NavigationContext";

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
  const { currentTopologyBlock, updateAmountOfChildBlocks } = useNavigation();
  const { addChoiceOption, getAmountOfChoiceOptions } = useChoiceOptions();
  const { episodeId } = useParams();
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = localStorage.getItem("theme");

  const createChoiceOption = useCreateChoiceOption({
    plotFieldCommandChoiceId,
    plotFieldCommandId,
    episodeId: episodeId || "",
    topologyBlockId,
    coordinatesX: currentTopologyBlock?.coordinatesX,
    coordinatesY: currentTopologyBlock?.coordinatesY,
    sourceBlockName: makeTopologyBlockName({
      name: currentTopologyBlock?.name || "",
      amountOfOptions: currentTopologyBlock?.topologyBlockInfo?.amountOfChildBlocks || 1,
    }),
  });

  const handleCreatingChoiceOption = (cov: ChoiceOptionVariationsTypes) => {
    const choiceOptionId = generateMongoObjectId();
    const targetBlockId = generateMongoObjectId();
    setShowCreateChoiceOptionModal(false);
    updateAmountOfChildBlocks("add");
    const amountOfChoiceOptions = getAmountOfChoiceOptions({
      plotfieldCommandId: plotFieldCommandId,
    });
    addChoiceOption({
      choiceId: plotFieldCommandChoiceId,
      choiceOption: {
        choiceOptionId,
        optionText: "",
        optionType: cov,
        topologyBlockId: targetBlockId,
        optionOrder: amountOfChoiceOptions,
        topologyBlockName: makeTopologyBlockName({
          name: currentTopologyBlock?.name || "",
          amountOfOptions: currentTopologyBlock?.topologyBlockInfo?.amountOfChildBlocks || 1,
        }),
      },
    });
    createChoiceOption.mutate({
      type: cov,
      choiceOptionId,
      targetBlockId,
      optionOrder: amountOfChoiceOptions,
    });
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
      } absolute right-0 z-[10] flex flex-col min-w-fit w-full rounded-md shadow-md p-[.5rem] bg-secondary`}
    >
      {ChoiceOptionVariations.map((cov) => (
        <button
          key={cov}
          onClick={() => handleCreatingChoiceOption(cov)}
          className={`hover:bg-primary-darker ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } transition-all text-[1.4rem] whitespace-nowrap text-text-light hover:text-text-light focus-within:bg-primary-darker focus-within:text-text-light px-[1rem] py-[.5rem] rounded-md`}
        >
          {cov}
        </button>
      ))}
    </aside>
  );
}

import { useParams } from "react-router-dom";
import useChoiceOptions from "../../Context/ChoiceContext";
import { useEffect, useRef, useState } from "react";
import useDeleteChoiceOption from "../../../../../hooks/Choice/ChoiceOption/useDeleteChoiceOption";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import { ChoiceOptionTypesAndTopologyBlockIdsTypes } from "../ChoiceOptionBlocksList";

type OptionVariationButtonTypes = {
  showedOptionPlotTopologyBlockId: string;
  plotfieldCommandId: string;
  isFocusedBackground: boolean;
  choiceId: string;
  currentTopologyBlockId: string;
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
} & ChoiceOptionTypesAndTopologyBlockIdsTypes;

export default function OptionVariationButton({
  showedOptionPlotTopologyBlockId,
  type,
  topologyBlockId,
  choiceOptionId,
  plotfieldCommandId,
  isFocusedBackground,
  choiceId,
  currentTopologyBlockId,
  setIsFocusedBackground,
  setShowOptionPlot,
}: OptionVariationButtonTypes) {
  const { episodeId } = useParams();
  const { updateCurrentlyOpenChoiceOption, getCurrentlyOpenChoiceOptionPlotId, getAmountOfChoiceOptions } =
    useChoiceOptions();

  const [suggestDeleting, setSuggestDeleting] = useState(false);
  const deleteRef = useRef<HTMLDivElement | null>(null);

  const deleteOption = useDeleteChoiceOption({
    choiceId,
    choiceOptionId,
    episodeId: episodeId || "",
    plotfieldCommandId,
    topologyBlockId: currentTopologyBlockId,
  });

  const buttonDeleteRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonDeleteRef.current) {
      buttonDeleteRef.current.focus();
    }
  }, [suggestDeleting]);

  useOutOfModal({
    modalRef: deleteRef,
    setShowModal: setSuggestDeleting,
    showModal: suggestDeleting,
  });

  const handleUpdatingSessionStorage = () => {
    // TODO deleted some shit here, need to remake functionality for focus
    // 1) changing at the same level
    // 2) changing at different level(may go up or down)
  };

  return (
    <div className="relative">
      <button
        onContextMenu={(e) => {
          e.preventDefault();
          setSuggestDeleting(true);
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.currentTarget.blur();
          if (topologyBlockId) {
            updateCurrentlyOpenChoiceOption({
              plotfieldCommandId,
              choiceOptionId,
            });
            handleUpdatingSessionStorage();
          } else {
            console.log("Выберите Топологический Блок");
            // setShowOptionPlot(false);
            // setShowedOptionPlotTopologyBlockId("");
            // setAllChoiceOptionTypesAndTopologyBlockIds([]);
          }
        }}
        className={`${
          topologyBlockId === showedOptionPlotTopologyBlockId ||
          getCurrentlyOpenChoiceOptionPlotId({ plotfieldCommandId }) === choiceOptionId
            ? "bg-primary-darker text-text-light focus-within:outline-secondary"
            : "bg-secondary"
        } ${
          isFocusedBackground && getCurrentlyOpenChoiceOptionPlotId({ plotfieldCommandId }) === choiceOptionId
            ? "border-dark-blue border-dashed border-[2px]"
            : ""
        } ${
          !topologyBlockId
            ? "hover:outline-red-200 focus-within:outline-red-200"
            : `focus-within:bg-primary-darker focus-within:text-text-dark`
        } text-[1.5rem] outline-none rounded-md px-[1rem] py-[.5rem] shadow-sm transition-all hover:text-text-light text-text-dark hover:bg-primary-darker `}
      >
        {type}
      </button>

      <aside
        ref={deleteRef}
        className={`${
          suggestDeleting ? "" : "hidden"
        } absolute translate-y-[10%] z-[1001] w-full text-center rounded-md bg-primary text-text-light text-[1.5rem]`}
      >
        <button
          ref={buttonDeleteRef}
          className="hover:bg-primary-darker transition-all w-full rounded-md p-[1rem] outline-light-gray focus-within:border-light-gray focus-within:border-[2px]"
          onClick={() => {
            const amount = getAmountOfChoiceOptions({ plotfieldCommandId });
            if (amount - 1 === 0) {
              setIsFocusedBackground(false);
              setShowOptionPlot(false);
            }
            setSuggestDeleting(false);
            deleteOption.mutate();
          }}
        >
          Удалить
        </button>
      </aside>
    </div>
  );
}

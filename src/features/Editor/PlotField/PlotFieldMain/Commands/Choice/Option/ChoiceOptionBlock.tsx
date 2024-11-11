import { useEffect, useRef, useState } from "react";
import useDebounce from "../../../../../../../hooks/utilities/useDebounce";
import useGetChoiceOptionById from "../../../../hooks/Choice/ChoiceOption/useGetChoiceOptionById";
import useUpdateChoiceOptionTranslationText from "../../../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionTranslationText";
import useChoiceOptions, { ChoiceOptionItemTypes } from "../Context/ChoiceContext";
import ChoiceOptionShowPlot from "./ChoiceOptionShowPlot";
import OptionSelectOrder from "./OptionSelectOrder";
import OptionSelectSexualOrientationBlock from "./OptionSelectSexualOrientationBlock";
import OptionSelectTopologyBlock from "./OptionSelectTopologyBlock";
import OptionCharacteristicBlock from "./OptionVariations/OptionCharacteristicBlock";
import OptionPremiumBlock from "./OptionVariations/OptionPremiumBlock";
import OptionRelationshipBlock from "./OptionVariations/OptionRelationshipBlock";
import useDeleteChoiceOption from "../../../../hooks/Choice/ChoiceOption/useDeleteChoiceOption";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";

type ChoiceOptionBlockTypes = {
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  currentTopologyBlockId: string;
  plotFieldCommandId: string;
  showOptionPlot: boolean;
  amountOfOptions: number;
  choiceId: string;
  updated: boolean;
  isFocusedBackground: boolean;
} & ChoiceOptionItemTypes;

export default function ChoiceOptionBlock({
  optionType,
  choiceId,
  choiceOptionId,
  showOptionPlot,
  plotFieldCommandId,
  currentTopologyBlockId,
  amountOfOptions,
  optionText,
  updated,
  isFocusedBackground,
  setShowOptionPlot,
}: ChoiceOptionBlockTypes) {
  const { episodeId } = useParams();

  const {
    updateChoiceOptionText,
    getChoiceOptionText,
    getChoiceOptionById,
    updateChoiceOptionOrder,
    updateChoiceOptionTopologyBlockId,
  } = useChoiceOptions();

  const theme = localStorage.getItem("theme");

  const [showAllSexualOrientationBlocks, setShowAllSexualOrientationBlocks] = useState(false);
  const [showAllTopologyBlocks, setShowAllTopologyBlocks] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

  const [suggestDeleting, setSuggestDeleting] = useState(false);
  const deleteRef = useRef<HTMLDivElement | null>(null);

  const buttonDeleteRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonDeleteRef.current) {
      buttonDeleteRef.current.focus();
    }
  }, [suggestDeleting]);

  const { data: choiceOption } = useGetChoiceOptionById({ choiceOptionId });
  const [sexualOrientationType, setSexualOrientationType] = useState("");

  useEffect(() => {
    if (choiceOption) {
      setSexualOrientationType(choiceOption?.sexualOrientationType || "");
      updateChoiceOptionOrder({
        choiceId,
        choiceOptionId,
        optionOrder: choiceOption?.optionOrder as number,
      });
      updateChoiceOptionTopologyBlockId({
        choiceId,
        choiceOptionId,
        topologyBlockId: choiceOption.topologyBlockId,
        topologyBlockName: getChoiceOptionById({ choiceId, choiceOptionId })?.topologyBlockName || "",
      });
    }
  }, [choiceOption, updated]);

  const debouncedValue = useDebounce({
    value: getChoiceOptionText({ choiceId, choiceOptionId }),
    delay: 700,
  });

  const deleteOption = useDeleteChoiceOption({
    choiceId,
    choiceOptionId,
    episodeId: episodeId || "",
    plotfieldCommandId: plotFieldCommandId,
    topologyBlockId: currentTopologyBlockId,
  });

  const updateOptionTextTranslation = useUpdateChoiceOptionTranslationText({
    choiceOptionId,
    option: debouncedValue,
    type: optionType,
    choiceId: plotFieldCommandId,
    language: "russian",
  });

  useEffect(() => {
    if ((optionText || "") !== debouncedValue && debouncedValue?.trim().length) {
      updateOptionTextTranslation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useOutOfModal({
    modalRef: deleteRef,
    setShowModal: setSuggestDeleting,
    showModal: suggestDeleting,
  });

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setSuggestDeleting(true);
      }}
      className={`${
        showOptionPlot || isFocusedBackground ? "hidden" : ""
      } w-full bg-secondary min-h-[10rem] h-full rounded-md shadow-md relative`}
    >
      <div className="w-full flex justify-between flex-col h-full">
        <input
          type="text"
          value={getChoiceOptionText({ choiceId, choiceOptionId })}
          onChange={(e) => {
            updateChoiceOptionText({
              choiceId,
              id: choiceOptionId,
              optionText: e.target.value,
            });
          }}
          placeholder="Ответ"
          className={`w-full text-[1.4rem] text-text-light rounded-md ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } shadow-md bg-secondary px-[1rem]`}
        />

        <div className="p-[.2rem] flex flex-col gap-[1rem]">
          {optionType === "premium" ? (
            <OptionPremiumBlock choiceOptionId={choiceOptionId} />
          ) : optionType === "characteristic" ? (
            <OptionCharacteristicBlock choiceOptionId={choiceOptionId} />
          ) : optionType === "relationship" ? (
            <OptionRelationshipBlock choiceOptionId={choiceOptionId} />
          ) : null}
          <div className="flex justify-between w-full">
            <div className={`${showAllSexualOrientationBlocks ? "" : "overflow-hidden"} w-[calc(50%+.5rem)] self-end`}>
              <OptionSelectSexualOrientationBlock
                setShowAllSexualOrientationBlocks={setShowAllSexualOrientationBlocks}
                setShowAllTopologyBlocks={setShowAllTopologyBlocks}
                showAllSexualOrientationBlocks={showAllSexualOrientationBlocks}
                choiceOptionId={choiceOptionId}
                sexualOrientation={sexualOrientationType}
              />
            </div>
            <div
              className={`${showAllTopologyBlocks || showAllOrders ? "" : "overflow-hidden"} w-[19.5rem] flex flex-col`}
            >
              <ChoiceOptionShowPlot
                setShowOptionPlot={setShowOptionPlot}
                topologyBlockId={getChoiceOptionById({ choiceId, choiceOptionId })?.topologyBlockId || ""}
                plotfieldCommandId={plotFieldCommandId}
                choiceOptionId={choiceOptionId}
              />
              <OptionSelectOrder
                amountOfOptions={amountOfOptions}
                choiceId={choiceOption?.plotFieldCommandChoiceId || ""}
                choiceOptionId={choiceOptionId}
                setShowAllOrders={setShowAllOrders}
                showAllOrders={showAllOrders}
                setShowAllTopologyBlocks={setShowAllTopologyBlocks}
              />
              <OptionSelectTopologyBlock
                choiceId={choiceId}
                setShowAllTopologyBlocks={setShowAllTopologyBlocks}
                setShowAllOrders={setShowAllOrders}
                showAllTopologyBlocks={showAllTopologyBlocks}
                choiceOptionId={choiceOptionId}
                currentTopologyBlockId={currentTopologyBlockId}
                topologyBlockId={getChoiceOptionById({ choiceId, choiceOptionId })?.topologyBlockId || ""}
                topologyBlockName={getChoiceOptionById({ choiceId, choiceOptionId })?.topologyBlockName || ""}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={deleteRef}
        className={`${
          suggestDeleting ? "" : "hidden"
        } absolute bottom-0 z-[100] w-full text-center rounded-md bg-primary text-text-light text-[1.5rem]`}
      >
        <button
          ref={buttonDeleteRef}
          className="hover:bg-primary-darker transition-all w-full rounded-md p-[1rem] outline-light-gray focus-within:border-light-gray focus-within:border-[2px]"
          onClick={() => deleteOption.mutate()}
        >
          Удалить
        </button>
      </div>
    </div>
  );
}

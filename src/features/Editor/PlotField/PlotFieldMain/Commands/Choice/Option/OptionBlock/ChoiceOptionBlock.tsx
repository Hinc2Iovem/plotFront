import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useAddItemInsideSearch from "../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useDeleteChoiceOption from "../../../../../hooks/Choice/ChoiceOption/useDeleteChoiceOption";
import useGetChoiceOptionById from "../../../../../hooks/Choice/ChoiceOption/useGetChoiceOptionById";
import useUpdateChoiceOptionTranslationText from "../../../../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionTranslationText";
import useChoiceOptions, { ChoiceOptionItemTypes } from "../../Context/ChoiceContext";
import ChoiceOptionShowPlot from "./ChoiceOptionShowPlot";
import OptionSelectSexualOrientationBlock from "./OptionSelectSexualOrientationBlock";
import OptionVariationFields from "./OptionVariationFields";
import TopologyBlockSelectOrderField from "./TopologyBlockSelectOrderField";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

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

  const [showAllSexualOrientationBlocks, setShowAllSexualOrientationBlocks] = useState(false);

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

  const deleteOption = useDeleteChoiceOption({
    choiceId,
    choiceOptionId,
    episodeId: episodeId || "",
    plotfieldCommandId: plotFieldCommandId,
    topologyBlockId: currentTopologyBlockId,
  });

  const updateOptionTextTranslation = useUpdateChoiceOptionTranslationText({
    choiceOptionId,
    option: getChoiceOptionText({ choiceId, choiceOptionId }),
    type: optionType,
    choiceId: plotFieldCommandId,
    language: "russian",
  });

  useAddItemInsideSearch({
    commandName: `Choice - ${optionType}`,
    id: choiceOptionId,
    text: getChoiceOptionText({ choiceId, choiceOptionId }),
    topologyBlockId: currentTopologyBlockId,
    type: "choiceOption",
  });

  const onBlur = () => {
    updateOptionTextTranslation.mutate();
  };

  useOutOfModal({
    modalRef: deleteRef,
    setShowModal: setSuggestDeleting,
    showModal: suggestDeleting,
  });
  const [overflow, setOverflow] = useState(true);

  useEffect(() => {
    if (showAllSexualOrientationBlocks) {
      const timer = setTimeout(() => {
        setOverflow(false);
      }, 100);

      return () => clearTimeout(timer);
    }

    setOverflow(true);
  }, [showAllSexualOrientationBlocks]);

  return (
    <div
      className={`${
        showOptionPlot || isFocusedBackground ? "hidden" : ""
      } w-full bg-secondary h-[192px] rounded-md shadow-md relative`}
    >
      <ContextMenu>
        <ContextMenuTrigger className="w-full flex justify-between flex-col h-full gap-[20px]">
          <PlotfieldInput
            type="text"
            value={getChoiceOptionText({ choiceId, choiceOptionId })}
            onChange={(e) => {
              updateChoiceOptionText({
                choiceId,
                id: choiceOptionId,
                optionText: e.target.value,
              });
            }}
            onBlur={onBlur}
            placeholder="Ответ"
            className={`w-full text-[13px] text-text rounded-md shadow-md bg-secondary px-[10px]`}
          />

          <div className="p-[2px] flex flex-col gap-[10px]">
            <div className="flex gap-[5px]">
              <OptionVariationFields choiceId={choiceId} choiceOptionId={choiceOptionId} optionType={optionType} />

              <TopologyBlockSelectOrderField
                choiceId={choiceId}
                choiceOptionId={choiceOptionId}
                plotFieldCommandChoiceId={choiceOption?.plotFieldCommandChoiceId || ""}
                amountOfOptions={amountOfOptions}
              />
            </div>

            <div className="flex justify-between w-full">
              <div className={`${overflow ? "overflow-hidden" : ""} w-[calc(50%+5px)]`}>
                <OptionSelectSexualOrientationBlock
                  setShowAllSexualOrientationBlocks={setShowAllSexualOrientationBlocks}
                  showAllSexualOrientationBlocks={showAllSexualOrientationBlocks}
                  choiceOptionId={choiceOptionId}
                  sexualOrientation={sexualOrientationType}
                />
              </div>

              <ChoiceOptionShowPlot
                setShowOptionPlot={setShowOptionPlot}
                topologyBlockId={getChoiceOptionById({ choiceId, choiceOptionId })?.topologyBlockId || ""}
                plotfieldCommandId={plotFieldCommandId}
                choiceOptionId={choiceOptionId}
              />
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem
            className="w-full rounded-md p-[10px] cursor-pointer focus-within:border-border focus-within:border-[2px]"
            onClick={() => deleteOption.mutate()}
          >
            Удалить
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

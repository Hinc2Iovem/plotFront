import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationAppearancePart from "../../../../../../../../../hooks/Fetching/Translation/useGetTranslationAppearancePart";
import PlotfieldButton from "../../../../../../../../../ui/Buttons/PlotfieldButton";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateConditionAppearance from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionAppearance";
import useConditionBlocks from "../../../Context/ConditionContext";
import ConditionBlockFieldName from "../shared/ConditionBlockFieldName";
import AppearancePartPromptsModal, { ExposedMethodsAppearance } from "./AppearancePartPromptsModal";
import CreateNewValueModal from "./CreateNewAppearancePart";

type ConditionBlockVariationAppearanceTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  currentAppearancePartId: string;
  conditionBlockVariationId: string;
  topologyBlockId: string;
  currentlyDressed: boolean;
};

export default function ConditionBlockVariationAppearance({
  plotfieldCommandId,
  conditionBlockId,
  currentAppearancePartId,
  conditionBlockVariationId,
  currentlyDressed,
  topologyBlockId,
}: ConditionBlockVariationAppearanceTypes) {
  const { episodeId } = useParams();
  const [showAppearancePartPromptModal, setShowAppearancePartPromptModal] = useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueNonExisting] = useState(false);
  const [appearancePartId, setAppearancePartId] = useState(currentAppearancePartId || "");
  const [initialValue, setInitialValue] = useState("");

  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const [currentConditionName, setCurrentConditionName] = useState("");
  const [isDressed, setIsDressed] = useState(currentlyDressed);
  const [currentlyActive, setCurrentlyActive] = useState(false);

  const { data: appearancePart } = useGetTranslationAppearancePart({ appearancePartId, language: "russian" });

  const updateConditionBlock = useUpdateConditionAppearance({
    conditionBlockAppearanceId: conditionBlockVariationId,
  });

  useEffect(() => {
    if (appearancePart) {
      setCurrentConditionName((appearancePart.translations || [])[0]?.text);
      setInitialValue((appearancePart.translations || [])[0]?.text);
    }
  }, [appearancePart, appearancePartId]);

  const inputRef = useRef<ExposedMethodsAppearance>(null);

  const onBlur = () => {
    if (inputRef.current) {
      inputRef.current.updateAppearancePartOnBlur();
    }
  };

  useAddItemInsideSearch({
    commandName: "Condition - Apperance",
    id: conditionBlockVariationId,
    text: currentConditionName || "",
    topologyBlockId,
    type: "conditionVariation",
  });

  const { updateValue } = useSearch();

  const updateValues = (value: string) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Condition - Apperance",
        id: conditionBlockVariationId,
        value: value || "",
        type: "conditionVariation",
      });
    }
  };

  return (
    <div className="relative w-full flex gap-[.5rem]">
      <div className="flex-grow relative">
        <PlotfieldInput
          type="text"
          onBlur={() => {
            setCurrentlyActive(false);
            onBlur();
          }}
          placeholder="Часть внешности"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentlyActive(true);
            setShowAppearancePartPromptModal((prev) => !prev);
          }}
          value={currentConditionName}
          onChange={(e) => {
            if (!showAppearancePartPromptModal) {
              setShowAppearancePartPromptModal(true);
            }
            setCurrentlyActive(true);
            setHighlightRedOnValueNonExisting(false);
            setCurrentConditionName(e.target.value);
            updateValues(e.target.value);
          }}
          className={`${highlightRedOnValueNonExisting ? "" : ""} border-[3px] border-double border-dark-mid-gray`}
        />

        <AppearancePartPromptsModal
          currentAppearancePartName={currentConditionName}
          setCurrentAppearancePartName={setCurrentConditionName}
          setShowAppearancePartPromptModal={setShowAppearancePartPromptModal}
          showAppearancePartPromptModal={showAppearancePartPromptModal}
          setAppearancePartId={setAppearancePartId}
          setInitialValue={setInitialValue}
          initialValue={initialValue}
          appearancePartId={appearancePartId}
          conditionBlockId={conditionBlockId}
          conditionBlockVariationId={conditionBlockVariationId}
          plotfieldCommandId={plotfieldCommandId}
          ref={inputRef}
        />

        <CreateNewValueModal
          conditionName={currentConditionName}
          conditionBlockAppearanceId={conditionBlockVariationId}
          setHighlightRedOnValueNonExisting={setHighlightRedOnValueNonExisting}
          setShowCreateNewValueModal={setShowCreateNewValueModal}
          showCreateNewValueModal={showCreateNewValueModal}
        />
        <ConditionBlockFieldName currentlyActive={currentlyActive} text="Одежда" />
      </div>

      <PlotfieldButton
        disabled={updateConditionBlock.isPending}
        onClick={() => {
          updateConditionBlock.mutate({ currentlyDressed: !isDressed });
          setIsDressed((prev) => !prev);
          updateConditionBlockVariationValue({
            conditionBlockId,
            conditionBlockVariationId,
            plotfieldCommandId,
            currentlyDressed,
          });
        }}
        className={`${
          isDressed ? "bg-green-600 hover:bg-green-500" : "bg-primary-darker hover:bg-primary"
        } disabled:cursor-not-allowed w-fit`}
      >
        {isDressed ? "Надето" : "Надеть"}
      </PlotfieldButton>
    </div>
  );
}

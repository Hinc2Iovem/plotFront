import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationAppearancePart from "../../../../../../../../../hooks/Fetching/Translation/useGetTranslationAppearancePart";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateConditionAppearance from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionAppearance";
import AppearancePartsPromptModal from "../../../../Prompts/AppearanceParts/AppearancePartsPromptModal";
import useConditionBlocks from "../../../Context/ConditionContext";
import ConditionBlockFieldName from "../shared/ConditionBlockFieldName";

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

  // TODO give ability to create new appearance
  return (
    <div className="relative w-full flex gap-[5px]">
      <div className="flex-grow relative">
        <AppearancePartsPromptModal
          onValueUpdating={({ appearancePartId }) => {
            updateConditionBlock.mutate({
              appearancePartId,
            });
            updateConditionBlockVariationValue({
              conditionBlockId,
              plotfieldCommandId,
              conditionBlockVariationId,
              appearancePartId,
            });
          }}
          onChange={(value) => {
            setCurrentlyActive(true);
            updateValues(value);
          }}
          onClick={() => {
            setCurrentlyActive(true);
          }}
          onBlur={() => {
            setCurrentlyActive(false);
          }}
          appearancePartId={appearancePartId}
          currentAppearancePartName={currentConditionName}
          initialValue={initialValue}
          setAppearancePartId={setAppearancePartId}
          setCurrentAppearancePartName={setCurrentConditionName}
          setInitialValue={setInitialValue}
        />
        <ConditionBlockFieldName currentlyActive={currentlyActive} text="Одежда" />
      </div>

      <Button
        type="button"
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
          isDressed ? "bg-green hover:shadow-sm hover:shadow-green" : "bg-accent hover:shadow-sm hover:shadow-accent"
        } text-text disabled:cursor-not-allowed active:scale-[.99] transition-all w-fit`}
      >
        {isDressed ? "Надето" : "Надеть"}
      </Button>
    </div>
  );
}

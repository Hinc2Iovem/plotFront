import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationAppearancePart from "../../../../../../../../../hooks/Fetching/Translation/useGetTranslationAppearancePart";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateIfAppearance from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfAppearance";
import AppearancePartsPromptModal from "../../../../Prompts/AppearanceParts/AppearancePartsPromptModal";
import useIfVariations from "../../../Context/IfContext";
import IfFieldName from "../shared/IfFieldName";

type IfVariationAppearanceTypes = {
  plotfieldCommandId: string;
  currentAppearancePartId: string;
  ifVariationId: string;
  topologyBlockId: string;
  currentlyDressed: boolean;
};

export default function IfVariationAppearance({
  plotfieldCommandId,
  currentAppearancePartId,
  ifVariationId,
  currentlyDressed,
  topologyBlockId,
}: IfVariationAppearanceTypes) {
  const { episodeId } = useParams();

  const { updateIfVariationValue } = useIfVariations();

  const [currentIfName, setCurrentIfName] = useState("");
  const [initValue, setInitValue] = useState("");
  const [appearancePartId, setAppearancePartId] = useState(currentAppearancePartId || "");
  const [isDressed, setIsDressed] = useState(currentlyDressed);
  const [currentlyActive, setCurrentlyActive] = useState(false);

  const { data: appearancePart } = useGetTranslationAppearancePart({ appearancePartId, language: "russian" });

  useEffect(() => {
    if (appearancePart) {
      setCurrentIfName((appearancePart.translations || [])[0]?.text);
      setInitValue((appearancePart.translations || [])[0]?.text);
    }
  }, [appearancePart, appearancePartId]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "If - Apperance",
    id: ifVariationId,
    text: currentIfName || "",
    topologyBlockId,
    type: "ifVariation",
  });

  const updateValues = (value: string) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Apperance",
        id: ifVariationId,
        value: value || "",
        type: "ifVariation",
      });
    }
  };

  const updateIf = useUpdateIfAppearance({
    ifAppearanceId: ifVariationId,
  });

  return (
    <div className="relative w-full flex gap-[.5rem]">
      <div className="flex-grow relative">
        <AppearancePartsPromptModal
          onValueUpdating={({ appearancePartId }) => {
            updateIf.mutate({
              appearancePartId,
            });
            updateIfVariationValue({
              plotfieldCommandId,
              ifVariationId,
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
          currentAppearancePartName={currentIfName}
          initialValue={initValue}
          setAppearancePartId={setAppearancePartId}
          setCurrentAppearancePartName={setCurrentIfName}
          setInitialValue={setInitValue}
        />

        <IfFieldName currentlyActive={currentlyActive} text="Одежда" />
      </div>

      <Button
        disabled={updateIf.isPending}
        onClick={() => {
          updateIf.mutate({ currentlyDressed: !isDressed });
          setIsDressed((prev) => !prev);
          updateIfVariationValue({
            ifVariationId,
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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationAppearancePart from "../../../../../../../../../hooks/Fetching/Translation/useGetTranslationAppearancePart";
import PlotfieldButton from "../../../../../../../../../ui/Buttons/PlotfieldButton";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateIfAppearance from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfAppearance";
import useIfVariations from "../../../Context/IfContext";
import IfFieldName from "../shared/IfFieldName";
import IfVariationAppearanceNewValueModal from "./IfVariationAppearanceNewValueModal";
import IfVariationAppearancePromptsModal from "./IfVariationAppearancePromptsModal";

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
  const [showAppearancePartPromptModal, setShowAppearancePartPromptModal] = useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueNonExisting] = useState(false);

  const { updateIfVariationValue } = useIfVariations();

  const [currentIfName, setCurrentIfName] = useState("");
  const [backUpName, setBackUpName] = useState("");
  const [appearancePartId, setAppearancePartId] = useState(currentAppearancePartId || "");
  const [isDressed, setIsDressed] = useState(currentlyDressed);
  const [currentlyActive, setCurrentlyActive] = useState(false);

  const { data: appearancePart } = useGetTranslationAppearancePart({ appearancePartId, language: "russian" });

  useEffect(() => {
    if (appearancePart) {
      setCurrentIfName((appearancePart.translations || [])[0]?.text);
      setBackUpName((appearancePart.translations || [])[0]?.text);
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
        <PlotfieldInput
          type="text"
          onBlur={() => {
            setCurrentlyActive(false);
          }}
          placeholder="Часть внешности"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentlyActive(true);
            setShowAppearancePartPromptModal((prev) => !prev);
          }}
          value={currentIfName}
          onChange={(e) => {
            if (!showAppearancePartPromptModal) {
              setShowAppearancePartPromptModal(true);
            }
            setCurrentlyActive(true);
            setHighlightRedOnValueNonExisting(false);
            setCurrentIfName(e.target.value);
            updateValues(e.target.value);
          }}
          className={`${highlightRedOnValueNonExisting ? "" : ""} border-[3px] border-double border-dark-mid-gray`}
        />

        <IfVariationAppearancePromptsModal
          backUpName={backUpName}
          ifVariationId={ifVariationId}
          plotfieldCommandId={plotfieldCommandId}
          setBackUpName={setBackUpName}
          currentAppearancePartName={currentIfName}
          setCurrentAppearancePartName={setCurrentIfName}
          setShowAppearancePartPromptModal={setShowAppearancePartPromptModal}
          showAppearancePartPromptModal={showAppearancePartPromptModal}
          setAppearancePartId={setAppearancePartId}
        />

        <IfVariationAppearanceNewValueModal
          ifName={currentIfName}
          ifAppearanceId={ifVariationId}
          setHighlightRedOnValueNonExisting={setHighlightRedOnValueNonExisting}
          setShowCreateNewValueModal={setShowCreateNewValueModal}
          showCreateNewValueModal={showCreateNewValueModal}
        />
        <IfFieldName currentlyActive={currentlyActive} text="Одежда" />
      </div>

      <PlotfieldButton
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
          isDressed ? "bg-green-600 hover:bg-green-500" : "bg-secondary hover:bg-primary"
        } disabled:cursor-not-allowed transition-colors w-fit`}
      >
        {isDressed ? "Надето" : "Надеть"}
      </PlotfieldButton>
    </div>
  );
}

import { useState } from "react";
import { useParams } from "react-router-dom";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateConditionLanguage from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionLanguage";
import SelectLanguage from "./SelectLanguage";
import useConditionBlocks from "../../../Context/ConditionContext";

type ConditionBlockVariationLanguageTypes = {
  currentLanguage: CurrentlyAvailableLanguagesTypes | null;
  conditionBlockId: string;
  conditionBlockVariationId: string;
  plotfieldCommandId: string;
  topologyBlockId: string;
};

export default function ConditionBlockVariationLanguage({
  currentLanguage,
  conditionBlockId,
  conditionBlockVariationId,
  plotfieldCommandId,
  topologyBlockId,
}: ConditionBlockVariationLanguageTypes) {
  const { episodeId } = useParams();
  const [language, setLanguage] = useState(
    typeof currentLanguage === "string" ? currentLanguage : ("" as CurrentlyAvailableLanguagesTypes)
  );
  const updateConditionBlockVariationValue = useConditionBlocks((state) => state.updateConditionBlockVariationValue);
  const updateConditionLanguage = useUpdateConditionLanguage({ conditionBlockLanguageId: conditionBlockVariationId });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "Condition - Language",
    id: conditionBlockVariationId,
    text: `${language}`,
    topologyBlockId,
    type: "conditionVariation",
  });

  const updateValues = (lan: string) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Condition - Language",
        id: conditionBlockVariationId,
        value: `${lan}`,
        type: "conditionVariation",
      });
    }
  };

  return (
    <SelectLanguage
      currentLanguage={language}
      setCurrentLanguage={setLanguage}
      onValueChange={(v) => {
        updateConditionBlockVariationValue({
          conditionBlockId,
          conditionBlockVariationId,
          plotfieldCommandId,
          currentLanguage: v,
        });
        updateValues(v);
        updateConditionLanguage.mutate({ language: v });
      }}
    />
  );
}

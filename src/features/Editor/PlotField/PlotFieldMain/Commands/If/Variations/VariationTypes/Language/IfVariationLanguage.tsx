import { useState } from "react";
import { useParams } from "react-router-dom";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateIfLanguage from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfLanguage";
import SelectLanguage from "../../../../Condition/PlotfieldInsideConditionBlock/ConditionBlockVariationInput/Language/SelectLanguage";
import useIfVariations from "../../../Context/IfContext";

type IfVariationLanguageTypes = {
  currentLanguage: CurrentlyAvailableLanguagesTypes | null;
  ifVariationId: string;
  plotfieldCommandId: string;
  topologyBlockId: string;
};

export default function IfVariationLanguage({
  currentLanguage,
  ifVariationId,
  plotfieldCommandId,
  topologyBlockId,
}: IfVariationLanguageTypes) {
  const { episodeId } = useParams();
  const [language, setLanguage] = useState(
    typeof currentLanguage === "string" ? currentLanguage : ("" as CurrentlyAvailableLanguagesTypes)
  );

  const { updateIfVariationValue } = useIfVariations();

  const updateIfLanguage = useUpdateIfLanguage({ ifLanguageId: ifVariationId });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "If - Language",
    id: ifVariationId,
    text: `${language}`,
    topologyBlockId,
    type: "ifVariation",
  });

  const updateValues = (lan: string) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Language",
        id: ifVariationId,
        value: `${lan}`,
        type: "ifVariation",
      });
    }
  };

  return (
    <SelectLanguage
      currentLanguage={language}
      setCurrentLanguage={setLanguage}
      onValueChange={(v) => {
        updateIfVariationValue({
          ifVariationId,
          plotfieldCommandId,
          currentLanguage: v,
        });
        updateValues(v);
        updateIfLanguage.mutate({ language: v });
      }}
    />
  );
}

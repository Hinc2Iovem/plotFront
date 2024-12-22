import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import {
  ALL_LANGUAGES,
  CurrentlyAvailableLanguagesTypes,
} from "../../../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import AsideScrollable from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldButton from "../../../../../../../../../ui/Buttons/PlotfieldButton";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateConditionLanguage from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionLanguage";
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
  const [language, setLanguage] = useState(typeof currentLanguage === "string" ? currentLanguage : "");
  const [showAllLangauges, setShowAllLanguages] = useState(false);

  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const languageModalRef = useRef<HTMLDivElement>(null);

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

  useOutOfModal({
    modalRef: languageModalRef,
    setShowModal: setShowAllLanguages,
    showModal: showAllLangauges,
  });

  return (
    <div className="relative w-full">
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowAllLanguages((prev) => !prev);
        }}
        type="button"
        className={` bg-primary-darker hover:bg-primary transition-colors text-text-light w-full`}
      >
        {language?.trim().length ? language : "Язык"}
      </PlotfieldButton>

      <AsideScrollable
        ref={languageModalRef}
        className={`${showAllLangauges ? "" : "hidden"} translate-y-[.5rem] z-[10] right-0 w-full min-w-fit`}
      >
        {ALL_LANGUAGES.map((l) => (
          <AsideScrollableButton
            key={l}
            onClick={() => {
              setLanguage(l);
              setShowAllLanguages(false);
              updateConditionBlockVariationValue({
                conditionBlockId,
                conditionBlockVariationId,
                plotfieldCommandId,
                currentLanguage: l,
              });
              updateValues(l);
              updateConditionLanguage.mutate({ language: l });
            }}
            type="button"
          >
            {l}
          </AsideScrollableButton>
        ))}
      </AsideScrollable>
    </div>
  );
}

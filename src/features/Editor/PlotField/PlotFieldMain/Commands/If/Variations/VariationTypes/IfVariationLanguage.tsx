import { useEffect, useRef, useState } from "react";
import {
  ALL_LANGUAGES,
  CurrentlyAvailableLanguagesTypes,
} from "../../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import PlotfieldButton from "../../../../../../../shared/Buttons/PlotfieldButton";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import useIfVariations from "../../Context/IfContext";
import useSearch from "../../../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";
import useUpdateIfLanguage from "../../../../../hooks/If/BlockVariations/patch/useUpdateIfLanguage";

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
  const [language, setLanguage] = useState(typeof currentLanguage === "string" ? currentLanguage : "");
  const [showAllLangauges, setShowAllLanguages] = useState(false);

  const { updateIfVariationValue } = useIfVariations();

  const languageModalRef = useRef<HTMLDivElement>(null);

  const updateIfLanguage = useUpdateIfLanguage({ ifLanguageId: ifVariationId });

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: "If - Language",
          id: ifVariationId,
          text: `${language}`,
          topologyBlockId,
          type: "ifVariation",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Language",
        id: ifVariationId,
        value: `${language}`,
        type: "ifVariation",
      });
    }
  }, [language, episodeId]);

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
        className={`bg-secondary hover:opacity-90 hover:bg-secondary focus-within:bg-secondary text-text-light w-full`}
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
              updateIfVariationValue({
                ifVariationId,
                plotfieldCommandId,
                currentLanguage: l,
              });

              updateIfLanguage.mutate({ language: l });
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

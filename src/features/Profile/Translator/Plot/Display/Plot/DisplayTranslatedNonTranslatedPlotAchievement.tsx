import { useEffect, useState } from "react";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameAchievementTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { CombinedTranslatedAndNonTranslatedAchievementTypes } from "../../Filters/FiltersEverythingPlotAchievement";
import useUpdateAchievementTranslation from "../../../../../../hooks/Patching/Translation/PlotfieldCoomands/useUpdateAchievementTranslation";
import "../../../../../Editor/Flowchart/FlowchartStyles.css";

type DisplayTranslatedNonTranslatedPlotAchievementTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  currentIndex: number;
  lastIndex: number;
} & CombinedTranslatedAndNonTranslatedAchievementTypes;

export default function DisplayTranslatedNonTranslatedPlotAchievement({
  languageToTranslate,
  translateFromLanguage,
  nonTranslated,
  translated,
  currentIndex,
  lastIndex,
}: DisplayTranslatedNonTranslatedPlotAchievementTypes) {
  const [itemId, setItemId] = useState("");

  const [translatedItemNameInitial, setTranslatedItemNameInitial] = useState("");
  const [translatedItemName, setTranslatedItemName] = useState("");

  const [itemNameInitial, setItemNameInitial] = useState("");
  const [itemName, setItemName] = useState("");

  useEffect(() => {
    if (translated) {
      setItemId(translated.achievementId);
      translated.translations?.map((t) => {
        if (t.textFieldName === "achievementName") {
          setTranslatedItemNameInitial(t.text);
          setTranslatedItemName(t.text);
        }
      });
    }
  }, [translated]);

  useEffect(() => {
    if (nonTranslated) {
      (nonTranslated.translations || [])?.map((nt) => {
        if (nt.textFieldName === "achievementName") {
          setItemNameInitial(nt.text);
          setItemName(nt.text);
        }
      });
    } else {
      setItemNameInitial("");
      setItemName("");
    }
  }, [nonTranslated, languageToTranslate]);

  const debouncedNameTranslated = useDebounce({
    value: translatedItemName,
    delay: 500,
  });

  const updateCharacterTranslationTranslated = useUpdateAchievementTranslation({
    language: translateFromLanguage,
    achievementId: itemId || nonTranslated?.achievementId || "",
    storyId: translated?.storyId || nonTranslated?.storyId || "",
  });

  useEffect(() => {
    if (translatedItemNameInitial !== debouncedNameTranslated && debouncedNameTranslated?.trim().length) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedNameTranslated,
        textFieldName: TranslationTextFieldName.AchievementName as TranslationTextFieldNameAchievementTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNameTranslated]);

  const debouncedName = useDebounce({
    value: itemName,
    delay: 500,
  });

  const updateCharacterTranslation = useUpdateAchievementTranslation({
    language: languageToTranslate,
    achievementId: itemId || nonTranslated?.achievementId || "",
    storyId: translated?.storyId || nonTranslated?.storyId || "",
  });

  useEffect(() => {
    if (itemNameInitial !== debouncedName && debouncedName?.trim().length) {
      updateCharacterTranslation.mutate({
        text: debouncedName,
        textFieldName: TranslationTextFieldName.AchievementName as TranslationTextFieldNameAchievementTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  return (
    <div
      className={`${
        currentIndex === lastIndex ? "col-span-full" : ""
      } h-fit max-h-[20rem] overflow-auto sm:flex-row flex-col w-full flex gap-[.5rem] bg-purple-200 p-[.5rem] rounded-md | containerScroll`}
    >
      <div
        className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-secondary overflow-auto | containerScroll`}
      >
        <form className="flex flex-col gap-[.5rem] p-[1rem] w-full" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={translatedItemName}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setTranslatedItemName(e.target.value)}
          />
        </form>
      </div>
      <div
        className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-secondary overflow-auto | containerScroll`}
      >
        <form className="flex flex-col gap-[.5rem] p-[1rem] w-full" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={itemName}
            placeholder="Название Предмета"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setItemName(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}

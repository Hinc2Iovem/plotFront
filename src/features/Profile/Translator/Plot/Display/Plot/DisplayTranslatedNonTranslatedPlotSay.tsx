import { useEffect, useState } from "react";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import useUpdateSayTranslation from "../../../../../../hooks/Patching/Translation/PlotfieldCoomands/useUpdateSayTranslation";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameSayTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import "../../../../../Editor/Flowchart/FlowchartStyles.css";
import { CombinedTranslatedAndNonTranslatedSayTypes } from "../../Filters/FiltersEverythingPlotSay";

type DisplayTranslatedNonTranslatedPlotSayTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  currentIndex: number;
  lastIndex: number;
} & CombinedTranslatedAndNonTranslatedSayTypes;

export default function DisplayTranslatedNonTranslatedPlotSay({
  languageToTranslate,
  translateFromLanguage,
  nonTranslated,
  translated,
  currentIndex,
  lastIndex,
}: DisplayTranslatedNonTranslatedPlotSayTypes) {
  const [itemId, setItemId] = useState("");

  const [translatedItemNameInitial, setTranslatedItemNameInitial] =
    useState("");
  const [translatedItemName, setTranslatedItemName] = useState("");

  const [itemNameInitial, setItemNameInitial] = useState("");
  const [itemName, setItemName] = useState("");

  useEffect(() => {
    if (translated) {
      setItemId(translated.commandId);
      translated.translations?.map((t) => {
        if (t.textFieldName === "sayText") {
          setTranslatedItemNameInitial(t.text);
          setTranslatedItemName(t.text);
        }
      });
    }
  }, [translated]);

  useEffect(() => {
    if (nonTranslated) {
      (nonTranslated.translations || [])?.map((nt) => {
        if (nt.textFieldName === "sayText") {
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

  const updateCharacterTranslationTranslated = useUpdateSayTranslation({
    language: translateFromLanguage,
    commandId: itemId || nonTranslated?.commandId || "",
    topologyBlockId:
      translated?.topologyBlockId || nonTranslated?.topologyBlockId || "",
  });

  useEffect(() => {
    if (
      translatedItemNameInitial !== debouncedNameTranslated &&
      debouncedNameTranslated?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedNameTranslated,
        textFieldName:
          TranslationTextFieldName.SayText as TranslationTextFieldNameSayTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNameTranslated]);

  const debouncedName = useDebounce({
    value: itemName,
    delay: 500,
  });

  const updateCharacterTranslation = useUpdateSayTranslation({
    language: languageToTranslate,
    commandId: itemId || nonTranslated?.commandId || "",
    topologyBlockId:
      translated?.topologyBlockId || nonTranslated?.topologyBlockId || "",
  });

  useEffect(() => {
    if (itemNameInitial !== debouncedName && debouncedName?.trim().length) {
      updateCharacterTranslation.mutate({
        text: debouncedName,
        textFieldName:
          TranslationTextFieldName.SayText as TranslationTextFieldNameSayTypes,
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
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
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
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
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

import { useEffect, useState } from "react";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import useUpdateGetItemTranslation from "../../../../../../hooks/Patching/Translation/PlotfieldCoomands/useUpdateGetItemTranslation";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameGetItemTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import "../../../../../Editor/Flowchart/FlowchartStyles.css";
import { CombinedTranslatedAndNonTranslatedGetItemTypes } from "../../Filters/FiltersEverythingPlotGetItem";

type DisplayTranslatedNonTranslatedPlotGetItemTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  currentIndex: number;
  lastIndex: number;
} & CombinedTranslatedAndNonTranslatedGetItemTypes;

export default function DisplayTranslatedNonTranslatedPlotGetItem({
  languageToTranslate,
  translateFromLanguage,
  nonTranslated,
  translated,
  currentIndex,
  lastIndex,
}: DisplayTranslatedNonTranslatedPlotGetItemTypes) {
  const [itemId, setItemId] = useState("");

  const [translatedItemNameInitial, setTranslatedItemNameInitial] =
    useState("");
  const [
    translatedItemDescriptionInitial,
    setTranslatedItemDescriptionInitial,
  ] = useState("");
  const [translatedButtonTextInitial, setTranslatedButtonTextInitial] =
    useState("");
  const [translatedItemName, setTranslatedItemName] = useState("");
  const [translatedItemDescription, setTranslatedItemDescription] =
    useState("");
  const [translatedButtonText, setTranslatedButtonText] = useState("");

  const [itemNameInitial, setItemNameInitial] = useState("");
  const [itemDescriptionInitial, setItemDescriptionInitial] = useState("");
  const [buttonTextInitial, setButtonTextInitial] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [buttonText, setButtonText] = useState("");

  useEffect(() => {
    if (translated) {
      setItemId(translated.commandId);
      translated.translations?.map((t) => {
        if (t.textFieldName === "itemName") {
          setTranslatedItemNameInitial(t.text);
          setTranslatedItemName(t.text);
        } else if (t.textFieldName === "itemDescription") {
          setTranslatedItemDescriptionInitial(t.text);
          setTranslatedItemDescription(t.text);
        } else if (t.textFieldName === "buttonText") {
          setTranslatedButtonTextInitial(t.text);
          setTranslatedButtonText(t.text);
        }
      });
    }
  }, [translated]);

  useEffect(() => {
    if (nonTranslated) {
      (nonTranslated.translations || [])?.map((nt) => {
        if (nt.textFieldName === "itemName") {
          setItemNameInitial(nt.text);
          setItemName(nt.text);
        } else if (nt.textFieldName === "itemDescription") {
          setItemDescriptionInitial(nt.text);
          setItemDescription(nt.text);
        } else if (nt.textFieldName === "buttonText") {
          setButtonTextInitial(nt.text);
          setButtonText(nt.text);
        }
      });
    } else {
      setItemNameInitial("");
      setItemName("");
      setItemDescriptionInitial("");
      setItemDescription("");
      setButtonTextInitial("");
      setButtonText("");
    }
  }, [nonTranslated, languageToTranslate]);

  const debouncedNameTranslated = useDebounce({
    value: translatedItemName,
    delay: 500,
  });
  const debouncedDescriptionTranslated = useDebounce({
    value: translatedItemDescription,
    delay: 500,
  });
  const debouncedButtonTextTranslated = useDebounce({
    value: translatedButtonText,
    delay: 500,
  });

  const updateCharacterTranslationTranslated = useUpdateGetItemTranslation({
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
          TranslationTextFieldName.ItemName as TranslationTextFieldNameGetItemTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNameTranslated]);

  useEffect(() => {
    if (
      translatedItemDescriptionInitial !== debouncedDescriptionTranslated &&
      debouncedDescriptionTranslated?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedDescriptionTranslated,
        textFieldName:
          TranslationTextFieldName.ItemDescription as TranslationTextFieldNameGetItemTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDescriptionTranslated]);

  useEffect(() => {
    if (
      translatedButtonTextInitial !== debouncedButtonTextTranslated &&
      debouncedButtonTextTranslated?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedButtonTextTranslated,
        textFieldName:
          TranslationTextFieldName.ButtonText as TranslationTextFieldNameGetItemTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedButtonTextTranslated]);

  const debouncedName = useDebounce({
    value: itemName,
    delay: 500,
  });
  const debouncedDescription = useDebounce({
    value: itemDescription,
    delay: 500,
  });
  const debouncedButtonText = useDebounce({
    value: buttonText,
    delay: 500,
  });

  const updateCharacterTranslation = useUpdateGetItemTranslation({
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
          TranslationTextFieldName.ItemName as TranslationTextFieldNameGetItemTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  useEffect(() => {
    if (
      itemDescriptionInitial !== debouncedDescription &&
      debouncedDescription?.trim().length
    ) {
      updateCharacterTranslation.mutate({
        text: debouncedDescription,
        textFieldName:
          TranslationTextFieldName.ItemDescription as TranslationTextFieldNameGetItemTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDescription]);

  useEffect(() => {
    if (
      buttonTextInitial !== debouncedButtonText &&
      debouncedButtonText?.trim().length
    ) {
      updateCharacterTranslation.mutate({
        text: debouncedButtonText,
        textFieldName:
          TranslationTextFieldName.ButtonText as TranslationTextFieldNameGetItemTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedButtonText]);

  return (
    <div
      className={`${
        currentIndex === lastIndex ? "col-span-full" : ""
      } h-fit max-h-[20rem] overflow-auto sm:flex-row flex-col w-full flex gap-[.5rem] bg-purple-200 p-[.5rem] rounded-md | containerScroll`}
    >
      <div
        className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-white overflow-auto | containerScroll`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={translatedItemName}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setTranslatedItemName(e.target.value)}
          />
          <input
            type="text"
            value={translatedButtonText}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setTranslatedButtonText(e.target.value)}
          />
          <textarea
            name="TranslatedItemDescription"
            id="translatedItemDescription"
            value={translatedItemDescription}
            onChange={(e) => setTranslatedItemDescription(e.target.value)}
            className="w-full max-h-[10rem] border-dotted border-gray-600 border-[2px] text-[1.4rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white | containerScroll"
          />
        </form>
      </div>
      <div
        className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-white overflow-auto | containerScroll`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={itemName}
            placeholder="Название Предмета"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            type="text"
            value={buttonText}
            placeholder="Текст Кнопки Предмета"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setButtonText(e.target.value)}
          />
          <textarea
            name="ItemDescription"
            id="itemDescription"
            value={itemDescription}
            placeholder="Описание Предмета"
            onChange={(e) => setItemDescription(e.target.value)}
            className="w-full max-h-[10rem] h-full border-dotted border-gray-600 border-[2px] text-[1.4rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white | containerScroll"
          />
        </form>
      </div>
    </div>
  );
}

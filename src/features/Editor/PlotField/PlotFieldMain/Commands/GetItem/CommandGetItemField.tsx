import { useEffect, useState } from "react";
import useUpdateGetItemTranslation from "../../../../../../hooks/Patching/Translation/PlotfieldCoomands/useUpdateGetItemTranslation";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useGetSingleGetItemTranslation from "../hooks/GetItem/useGetSingleGetItemTranslation";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationTextFieldNameGetItemTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type CommandGetItemFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandGetItemField({
  topologyBlockId,
  plotFieldCommandId,
  command,
}: CommandGetItemFieldTypes) {
  const [nameValue] = useState<string>(command ?? "GetItem");
  const [itemNameInitial, setItemNameInitial] = useState("");
  const [itemDescriptionInitial, setItemDescriptionInitial] = useState("");
  const [buttonTextInitial, setButtonTextInitial] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const theme = localStorage.getItem("theme");

  const { data: getItem } = useGetSingleGetItemTranslation({
    plotFieldCommandId,
    language: "russian",
  });

  const updateGetItemTranslationTexts = useUpdateGetItemTranslation({
    topologyBlockId,
    language: "russian",
    commandId: plotFieldCommandId,
  });

  useEffect(() => {
    if (
      getItem &&
      (!itemDescription.trim().length ||
        !itemName.trim().length ||
        !buttonText.trim().length)
    ) {
      (getItem.translations || [])?.map((tgi) => {
        if (tgi.textFieldName === "itemDescription") {
          setItemDescription(tgi.text);
          setItemDescriptionInitial(tgi.text);
        } else if (tgi.textFieldName === "itemName") {
          setItemName(tgi.text);
          setItemNameInitial(tgi.text);
        } else if (tgi.textFieldName === "buttonText") {
          setButtonText(tgi.text);
          setButtonTextInitial(tgi.text);
        }
      });
    }
  }, [getItem]);

  const debouncedItemNameValue = useDebounce({ value: itemName, delay: 500 });
  const debouncedItemDescriptionValue = useDebounce({
    value: itemDescription,
    delay: 500,
  });
  const debouncedButtonTextValue = useDebounce({
    value: buttonText,
    delay: 500,
  });

  useEffect(() => {
    if (
      debouncedItemNameValue !== itemNameInitial &&
      debouncedItemNameValue?.trim().length
    ) {
      updateGetItemTranslationTexts.mutate({
        text: debouncedItemNameValue,
        textFieldName:
          TranslationTextFieldName.ItemName as TranslationTextFieldNameGetItemTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedItemNameValue]);

  useEffect(() => {
    if (
      debouncedItemDescriptionValue !== itemDescriptionInitial &&
      debouncedItemDescriptionValue?.trim().length
    ) {
      updateGetItemTranslationTexts.mutate({
        text: debouncedItemDescriptionValue,
        textFieldName:
          TranslationTextFieldName.ItemDescription as TranslationTextFieldNameGetItemTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedItemDescriptionValue]);

  useEffect(() => {
    if (
      debouncedButtonTextValue !== buttonTextInitial &&
      debouncedButtonTextValue?.trim().length
    ) {
      updateGetItemTranslationTexts.mutate({
        text: debouncedButtonTextValue,
        textFieldName:
          TranslationTextFieldName.ButtonText as TranslationTextFieldNameGetItemTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedButtonTextValue]);

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <h3 className="text-[1.3rem] text-text-light text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-secondary cursor-default">
          {nameValue}
        </h3>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="sm:w-[77%] flex-grow w-full flex flex-col gap-[1rem]"
      >
        <input
          value={itemName}
          type="text"
          className={`w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md`}
          placeholder="Название"
          onChange={(e) => setItemName(e.target.value)}
        />
        <textarea
          value={itemDescription}
          className={`w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]`}
          placeholder="Описание"
          onChange={(e) => setItemDescription(e.target.value)}
        />
        <input
          value={buttonText}
          type="text"
          className={`w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md`}
          placeholder="Текст Кнопки"
          onChange={(e) => setButtonText(e.target.value)}
        />
      </form>
    </div>
  );
}

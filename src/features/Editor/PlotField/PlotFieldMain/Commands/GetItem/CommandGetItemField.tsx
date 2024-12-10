import { useEffect, useState } from "react";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useUpdateGetItemTranslation from "../../../../../../hooks/Patching/Translation/PlotfieldCoomands/useUpdateGetItemTranslation";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import { TranslationTextFieldNameGetItemTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import PlotfieldTextarea from "../../../../../shared/Textareas/PlotfieldTextarea";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import useGetSingleGetItemTranslation from "../../../hooks/GetItem/useGetSingleGetItemTranslation";
import useSearch from "../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";

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
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "GetItem");
  const [itemNameInitial, setItemNameInitial] = useState("");
  const [itemDescriptionInitial, setItemDescriptionInitial] = useState("");
  const [buttonTextInitial, setButtonTextInitial] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [buttonText, setButtonText] = useState("");

  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
  const [focusedSecondTimeFirst, setFocusedSecondTimeFirst] = useState(false);
  const [focusedSecondTimeSecond, setFocusedSecondTimeSecond] = useState(false);

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
    if (getItem && (!itemDescription.trim().length || !itemName.trim().length || !buttonText.trim().length)) {
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

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: nameValue || "getItem",
          id: plotFieldCommandId,
          text: `${itemName} ${itemDescription} ${buttonText}`,
          topologyBlockId,
          type: "command",
        },
      });
    }
  }, [episodeId]);

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
    if (debouncedItemNameValue !== itemNameInitial && debouncedItemNameValue?.trim().length) {
      updateGetItemTranslationTexts.mutate({
        text: debouncedItemNameValue,
        textFieldName: TranslationTextFieldName.ItemName as TranslationTextFieldNameGetItemTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedItemNameValue]);

  useEffect(() => {
    if (debouncedItemDescriptionValue !== itemDescriptionInitial && debouncedItemDescriptionValue?.trim().length) {
      updateGetItemTranslationTexts.mutate({
        text: debouncedItemDescriptionValue,
        textFieldName: TranslationTextFieldName.ItemDescription as TranslationTextFieldNameGetItemTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedItemDescriptionValue]);

  useEffect(() => {
    if (debouncedButtonTextValue !== buttonTextInitial && debouncedButtonTextValue?.trim().length) {
      updateGetItemTranslationTexts.mutate({
        text: debouncedButtonTextValue,
        textFieldName: TranslationTextFieldName.ButtonText as TranslationTextFieldNameGetItemTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedButtonTextValue]);

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: nameValue || "getItem",
        id: plotFieldCommandId,
        value: `${debouncedItemNameValue} ${debouncedItemDescriptionValue} ${debouncedButtonTextValue}`,
        type: "command",
      });
    }
  }, [debouncedButtonTextValue, debouncedItemDescriptionValue, debouncedItemNameValue]);

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full flex flex-col gap-[1rem]">
        <PlotfieldInput
          focusedSecondTime={focusedSecondTimeFirst}
          setFocusedSecondTime={setFocusedSecondTimeFirst}
          value={itemName}
          type="text"
          placeholder="Название"
          onChange={(e) => setItemName(e.target.value)}
        />
        <PlotfieldTextarea
          value={itemDescription}
          placeholder="Описание"
          onChange={(e) => setItemDescription(e.target.value)}
        />
        <PlotfieldInput
          focusedSecondTime={focusedSecondTimeSecond}
          setFocusedSecondTime={setFocusedSecondTimeSecond}
          value={buttonText}
          type="text"
          placeholder="Текст Кнопки"
          onChange={(e) => setButtonText(e.target.value)}
        />
      </form>
    </div>
  );
}

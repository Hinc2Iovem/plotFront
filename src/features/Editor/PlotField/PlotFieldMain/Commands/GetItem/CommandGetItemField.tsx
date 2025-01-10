import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import useUpdateGetItemTranslation from "../../../../../../hooks/Patching/Translation/PlotfieldCoomands/useUpdateGetItemTranslation";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldTextarea from "../../../../../../ui/Textareas/PlotfieldTextarea";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetSingleGetItemTranslation from "../../../hooks/GetItem/useGetSingleGetItemTranslation";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";

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
  const [initValues, setInitValues] = useState({
    name: "",
    description: "",
    text: "",
  });
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [buttonText, setButtonText] = useState("");

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

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
          setInitValues((prev) => ({
            ...prev,
            description: tgi.text,
          }));
        } else if (tgi.textFieldName === "itemName") {
          setItemName(tgi.text);
          setInitValues((prev) => ({
            ...prev,
            name: tgi.text,
          }));
        } else if (tgi.textFieldName === "buttonText") {
          setButtonText(tgi.text);
          setInitValues((prev) => ({
            ...prev,
            text: tgi.text,
          }));
        }
      });
    }
  }, [getItem]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "getItem",
    id: plotFieldCommandId,
    text: `${itemName} ${itemDescription} ${buttonText}`,
    topologyBlockId,
    type: "command",
  });

  const onBlur = (text: string, textFieldName: string) => {
    // ButtonText: "buttonText",
    // ItemDescription: "itemDescription",
    // ItemName: "itemName",

    // could just change keys, but feeling extra today
    const dynamicKey =
      textFieldName === "buttonText" ? "text" : textFieldName === "itemDescription" ? "description" : "name";

    setInitValues((prev) => ({
      ...prev,
      [dynamicKey]: text,
    }));

    updateGetItemTranslationTexts.mutate({
      text: text,
      textFieldName: textFieldName,
    });

    if (episodeId) {
      updateValue({
        episodeId,
        commandName: nameValue || "getItem",
        id: plotFieldCommandId,
        value: `${itemName} ${itemDescription} ${buttonText}`,
        type: "command",
      });
    }
  };

  return (
    <div className="w-full border-border border-[1px] rounded-md p-[5px] flex flex-col gap-[5px]">
      <div className="flex flex-wrap gap-[5px] w-full sm:flex-row flex-col">
        <div className="sm:w-[20%] min-w-[100px] relative">
          <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"}`}>
            {nameValue}
          </PlotfieldCommandNameField>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow flex sm:flex-row flex-col gap-[5px]">
          <PlotfieldInput
            value={itemName}
            type="text"
            placeholder="Название"
            className="w-auto flex-grow"
            onBlur={() => {
              if (itemName !== initValues.name) {
                onBlur(itemName, TranslationTextFieldName.ItemName);
              }
            }}
            onChange={(e) => setItemName(e.target.value)}
          />

          <PlotfieldInput
            value={buttonText}
            type="text"
            placeholder="Текст Кнопки"
            onBlur={() => {
              if (buttonText !== initValues.text) {
                onBlur(buttonText, TranslationTextFieldName.ButtonText);
              }
            }}
            onChange={(e) => setButtonText(e.target.value)}
          />
        </form>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="w-full">
        <PlotfieldTextarea
          value={itemDescription}
          placeholder="Описание"
          className="w-full flex-grow"
          onBlur={() => {
            if (itemDescription !== initValues.description) {
              onBlur(itemDescription, TranslationTextFieldName.ItemDescription);
            }
          }}
          onChange={(e) => setItemDescription(e.target.value)}
        />
      </form>
    </div>
  );
}

import { useState } from "react";
import useUpdateChoiceTranslation from "../../../../../../../hooks/Patching/Translation/PlotfieldCoomands/useUpdateChoiceTranslation";
import PlotfieldInput from "../../../../../../../ui/Inputs/PlotfieldInput";
import TextSettingsModal from "../../../../../components/TextSettingsModal";
import useSearch from "../../../../../Context/Search/SearchContext";
import { checkTextStyle } from "../../../../utils/checkTextStyleTextSide";
import { useParams } from "react-router-dom";
import { TextStyleTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { TranslationTextFieldName } from "../../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationTextFieldNameChoiceTypes } from "../../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type ChoiceQuestionFieldSectionTypes = {
  question: string;
  isAuthor: boolean;
  plotFieldCommandId: string;
  characterName: string | null;
  topologyBlockId: string;
  textStyle: TextStyleTypes;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChoiceQuestionFieldSection({
  question,
  isAuthor,
  textStyle,
  plotFieldCommandId,
  characterName,
  topologyBlockId,
  setQuestion,
}: ChoiceQuestionFieldSectionTypes) {
  const { episodeId } = useParams();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentTextStyle, setCurrentTextStyle] = useState(textStyle);

  const { updateValue } = useSearch();

  const updateChoiceTranslation = useUpdateChoiceTranslation({
    commandId: plotFieldCommandId,
    language: "russian",
    topologyBlockId,
  });

  // TODO I do not add emotion name to search, that's wierd, need to fix it here and on backend side
  const onBlur = () => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Choice",
        id: plotFieldCommandId,
        value: isAuthor ? question : `${typeof characterName === "string" ? characterName : ""} ${question}`,
        type: "command",
      });

      updateChoiceTranslation.mutate({
        text: question,
        textFieldName: TranslationTextFieldName.ChoiceQuestion as TranslationTextFieldNameChoiceTypes,
      });

      checkTextStyle({ debouncedValue: question, setCurrentTextStyle });
    }
  };

  return (
    <form className="flex-grow relative" onSubmit={(e) => e.preventDefault()}>
      <PlotfieldInput
        type="text"
        value={question}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowSettingsModal((prev) => !prev);
        }}
        onBlur={onBlur}
        onChange={(e) => setQuestion(e.target.value)}
        className={`${
          currentTextStyle === "underscore"
            ? "underline"
            : currentTextStyle === "bold"
            ? "font-bold"
            : currentTextStyle === "italic"
            ? "italic"
            : ""
        }`}
        placeholder="Вопрос"
      />
      <TextSettingsModal
        plotfieldCommandId={plotFieldCommandId}
        translateY="translate-y-[-11rem]"
        setShowModal={setShowSettingsModal}
        setTextValue={setQuestion}
        showModal={showSettingsModal}
        showTextSideRow={false}
        showTextStyleRow={true}
        currentTextStyle={currentTextStyle}
        setCurrentTextStyle={setCurrentTextStyle}
      />
    </form>
  );
}

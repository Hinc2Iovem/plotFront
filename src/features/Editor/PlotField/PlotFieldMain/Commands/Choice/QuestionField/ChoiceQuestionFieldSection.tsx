import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TranslationTextFieldName } from "../../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import useUpdateChoiceTranslation from "../../../../../../../hooks/Patching/Translation/PlotfieldCoomands/useUpdateChoiceTranslation";
import { TranslationTextFieldNameChoiceTypes } from "../../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { TextStyleTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import PlotfieldInput from "../../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../../Context/Search/SearchContext";
import { checkTextStyle } from "../../../../utils/checkTextStyleTextSide";

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

  const [localQuestion, setLocalQuestion] = useState(question || "");
  useEffect(() => {
    setLocalQuestion(question);
  }, [question]);

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
    if (question === localQuestion && localQuestion.trim().length) {
      return;
    }

    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Choice",
        id: plotFieldCommandId,
        value: isAuthor ? question : `${typeof characterName === "string" ? characterName : ""} ${question}`,
        type: "command",
      });

      updateChoiceTranslation.mutate({
        text: localQuestion,
        textFieldName: TranslationTextFieldName.ChoiceQuestion as TranslationTextFieldNameChoiceTypes,
      });

      setQuestion(localQuestion);
      checkTextStyle({ debouncedValue: question, setCurrentTextStyle });
    }
  };

  return (
    <form className="flex-grow relative" onSubmit={(e) => e.preventDefault()}>
      <PlotfieldInput
        type="text"
        value={localQuestion}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowSettingsModal((prev) => !prev);
        }}
        onBlur={onBlur}
        onChange={(e) => setLocalQuestion(e.target.value)}
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
    </form>
  );
}

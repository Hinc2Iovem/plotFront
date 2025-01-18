import { useState } from "react";
import { TextStyleTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useAddItemInsideSearch from "../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import CreateChoiceOptionTypeModal from "../Option/CreateChoiceOptionTypeModal";
import ChoiceQuestionFieldSection from "./ChoiceQuestionFieldSection";
import QuestionFieldCharacterAuthorSection from "./QuestionFieldCharacterAuthorSection";
import useAssignInitialValueChoice from "./useAssignInitialValueChoice";

type ChoiceQuestionFieldTypes = {
  characterId: string;
  characterEmotionId: string;
  isAuthor: boolean;
  choiceId: string;
  plotFieldCommandId: string;
  topologyBlockId: string;
  textStyle: TextStyleTypes;
};

export default function ChoiceQuestionField({
  characterId,
  characterEmotionId,
  isAuthor,
  choiceId,
  topologyBlockId,
  plotFieldCommandId,
  textStyle,
}: ChoiceQuestionFieldTypes) {
  const [question, setQuestion] = useState("");
  const { allEmotions, setEmotionValue, setCharacterValue, emotionValue, characterValue } = useAssignInitialValueChoice(
    {
      characterEmotionId,
      characterId,
      plotFieldCommandId,
      question,
      setQuestion,
    }
  );

  useAddItemInsideSearch({
    commandName: "Choice",
    id: plotFieldCommandId,
    text: isAuthor
      ? question
      : `${typeof characterValue.characterName === "string" ? characterValue.characterName : ""} ${question}`,
    topologyBlockId,
    type: "command",
  });

  return (
    <div className="w-full flex-grow flex gap-[5px] bg-primary rounded-md shadow-md flex-wrap items-center">
      <QuestionFieldCharacterAuthorSection
        choiceId={choiceId}
        isAuthor={isAuthor}
        allEmotions={allEmotions || []}
        characterValue={characterValue}
        emotionValue={emotionValue}
        setCharacterValue={setCharacterValue}
        setEmotionValue={setEmotionValue}
      />

      <div className="w-full flex gap-[5px] flex-wrap">
        {/* TODO here onContextMenu */}
        <ChoiceQuestionFieldSection
          characterName={characterValue.characterName}
          isAuthor={isAuthor}
          plotFieldCommandId={plotFieldCommandId}
          question={question}
          setQuestion={setQuestion}
          textStyle={textStyle}
          topologyBlockId={topologyBlockId}
        />

        <CreateChoiceOptionTypeModal
          plotFieldCommandId={plotFieldCommandId}
          topologyBlockId={topologyBlockId}
          plotFieldCommandChoiceId={choiceId}
        />
      </div>
    </div>
  );
}

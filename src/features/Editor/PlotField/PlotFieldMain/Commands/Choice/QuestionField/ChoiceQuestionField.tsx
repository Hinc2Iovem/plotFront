import { useEffect, useState } from "react";
import { TextStyleTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import ButtonHoverPromptModal from "../../../../../../../ui/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import plus from "../../../../../../../assets/images/shared/add.png";
import useAddItemInsideSearch from "../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateChoice from "../../../../hooks/Choice/useUpdateChoice";
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
  const [initialCharacterEmotionId] = useState(characterEmotionId);
  const [showCreateChoiceOptionModal, setShowCreateChoiceOptionModal] = useState(false);
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

  const updateChoice = useUpdateChoice({ choiceId });

  useEffect(() => {
    if (initialCharacterEmotionId !== emotionValue.emotionId && emotionValue.emotionId?.trim().length) {
      updateChoice.mutate({ characterEmotionId: emotionValue.emotionId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emotionValue.emotionId]);

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
    <div className="w-full flex-grow flex gap-[1rem] bg-primary rounded-md shadow-md p-[.5rem] flex-wrap items-center">
      <QuestionFieldCharacterAuthorSection
        choiceId={choiceId}
        isAuthor={isAuthor}
        allEmotions={allEmotions || []}
        characterValue={characterValue}
        emotionValue={emotionValue}
        setCharacterValue={setCharacterValue}
        setEmotionValue={setEmotionValue}
      />

      <ChoiceQuestionFieldSection
        characterName={characterValue.characterName}
        isAuthor={isAuthor}
        plotFieldCommandId={plotFieldCommandId}
        question={question}
        setQuestion={setQuestion}
        textStyle={textStyle}
        topologyBlockId={topologyBlockId}
      />

      <div className="relative ml-auto">
        <ButtonHoverPromptModal
          onClick={(e) => {
            e.stopPropagation();
            setShowCreateChoiceOptionModal((prev) => !prev);
          }}
          variant={"rectangle"}
          contentName="Создать Ответ"
          positionByAbscissa="right"
          asideClasses="text-[1.4rem] text-text-light"
          className="bg-secondary rounded-md shadow-md p-[.2rem]"
        >
          <img src={plus} alt="Add" className="w-[3rem] object-contain" />
        </ButtonHoverPromptModal>

        <CreateChoiceOptionTypeModal
          plotFieldCommandId={plotFieldCommandId}
          topologyBlockId={topologyBlockId}
          plotFieldCommandChoiceId={choiceId}
          setShowCreateChoiceOptionModal={setShowCreateChoiceOptionModal}
          showCreateChoiceOptionModal={showCreateChoiceOptionModal}
        />
      </div>
    </div>
  );
}

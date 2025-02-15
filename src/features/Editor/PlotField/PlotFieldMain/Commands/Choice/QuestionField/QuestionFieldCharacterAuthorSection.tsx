import useUpdateChoice from "@/features/Editor/PlotField/hooks/Choice/useUpdateChoice";
import { EmotionsTypes } from "../../../../../../../types/StoryData/Character/CharacterTypes";
import {
  CharacterValueTypes,
  EmotionTypes,
} from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import ChoiceQuestionCharacterField from "./ChoiceQuestionCharacterField";
import EmotionPromptCreationWrapper from "../../../components/EmotionPromptCreationWrapper/EmotionPromptCreationWrapper";

type QuestionFieldCharacterAuthorSectionTypes = {
  isAuthor: boolean;
  choiceId: string;
  emotionValue: EmotionTypes;
  characterValue: CharacterValueTypes;
  allEmotions: EmotionsTypes[];
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionTypes>>;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
};

export default function QuestionFieldCharacterAuthorSection({
  choiceId,
  isAuthor,
  emotionValue,
  characterValue,
  allEmotions,
  setCharacterValue,
  setEmotionValue,
  setCharacterId,
}: QuestionFieldCharacterAuthorSectionTypes) {
  const updateChoice = useUpdateChoice({ choiceId });

  return (
    <>
      {isAuthor ? null : (
        <>
          <ChoiceQuestionCharacterField
            choiceId={choiceId}
            characterValue={characterValue}
            setCharacterValue={setCharacterValue}
            setCharacterId={setCharacterId}
          />

          <EmotionPromptCreationWrapper
            characterId={characterValue._id || ""}
            inputClasses="w-full pr-[35px] text-text md:text-[17px]"
            imgClasses="w-[30px] object-cover rounded-md top-1/2 -translate-y-1/2 right-[3px] absolute"
            containerClasses="flex-grow min-w-[200px] relative"
            emotions={allEmotions}
            initEmotionValue={emotionValue}
            onBlur={(emotionValue) => {
              setEmotionValue({
                _id: emotionValue._id,
                imgUrl: emotionValue.imgUrl || "",
                emotionName: emotionValue.emotionName,
              });

              setEmotionValue(emotionValue);
              updateChoice.mutate({ characterEmotionId: emotionValue._id || "" });
            }}
          />
        </>
      )}
    </>
  );
}

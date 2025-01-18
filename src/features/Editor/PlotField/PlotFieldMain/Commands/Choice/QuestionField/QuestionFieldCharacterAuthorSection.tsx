import { useState } from "react";
import { EmotionsTypes } from "../../../../../../../types/StoryData/Character/CharacterTypes";
import {
  CharacterValueTypes,
  EmotionTypes,
} from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import { AllEmotionsModal } from "../../Say/CommandSayFieldItem/Character/FormEmotion";
import ChoiceQuestionCharacterField from "./ChoiceQuestionCharacterField";
import useUpdateChoice from "@/features/Editor/PlotField/hooks/Choice/useUpdateChoice";

type QuestionFieldCharacterAuthorSectionTypes = {
  isAuthor: boolean;
  choiceId: string;
  emotionValue: EmotionTypes;
  characterValue: CharacterValueTypes;
  allEmotions: EmotionsTypes[];
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionTypes>>;
};

export default function QuestionFieldCharacterAuthorSection({
  choiceId,
  isAuthor,
  emotionValue,
  characterValue,
  allEmotions,
  setCharacterValue,
  setEmotionValue,
}: QuestionFieldCharacterAuthorSectionTypes) {
  const [emotionInitValue, setEmotionInitValue] = useState(emotionValue.emotionName || "");
  const updateChoice = useUpdateChoice({ choiceId });

  return (
    <>
      {isAuthor ? null : (
        <>
          <ChoiceQuestionCharacterField
            choiceId={choiceId}
            characterValue={characterValue}
            setCharacterValue={setCharacterValue}
          />

          <AllEmotionsModal
            inputClasses="w-full pr-[35px] text-text md:text-[17px]"
            imgClasses="w-[30px] object-cover rounded-md right-0 absolute"
            containerClasses="flex-grow min-w-[200px]"
            emotionName={emotionValue.emotionName || ""}
            emotionValue={emotionValue}
            emotions={allEmotions}
            initValue={emotionInitValue}
            setEmotionValue={setEmotionValue}
            onSubmit={({ emotionValue }) => {
              setEmotionValue({
                _id: emotionValue._id,
                imgUrl: emotionValue.imgUrl || "",
                emotionName: emotionValue.emotionName,
              });
              setEmotionInitValue(emotionValue.emotionName);
              updateChoice.mutate({ characterEmotionId: emotionValue._id });
            }}
          />
        </>
      )}
    </>
  );
}

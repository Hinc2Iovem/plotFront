import { useEffect, useState } from "react";
import useGetTranslationCharacterById from "../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import useGetCharacterById from "../../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetCommandChoiceTranslation from "../../../../hooks/Choice/useGetCommandChoiceTranslation";
import { EmotionValueTypes } from "../../Prompts/Emotions/PlotfieldEmotionPromptMain";
import { CharacterValueTypes } from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";

type AssignInitialValueChoiceTypes = {
  characterId: string;
  plotFieldCommandId: string;
  characterEmotionId: string;
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
};

export default function useAssignInitialValueChoice({
  characterEmotionId,
  characterId,
  plotFieldCommandId,
  question,
  setQuestion,
}: AssignInitialValueChoiceTypes) {
  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>({
    _id: characterId || null,
    characterName: null,
    imgUrl: null,
  });

  const [emotionValue, setEmotionValue] = useState<EmotionValueTypes>({
    emotionId: characterEmotionId || null,
    emotionImg: null,
    emotionName: null,
  });

  const { data: translatedCharacter } = useGetTranslationCharacterById({
    characterId,
    language: "russian",
  });

  const { data: currentCharacter } = useGetCharacterById({ characterId });

  const { data: translatedQuestion } = useGetCommandChoiceTranslation({
    commandId: plotFieldCommandId,
  });

  useEffect(() => {
    if (translatedCharacter) {
      translatedCharacter.translations?.map((tc) => {
        if (tc.textFieldName === "characterName") {
          setCharacterValue((prev) => ({
            ...prev,
            characterName: tc.text || "",
          }));
        }
      });
    }
  }, [translatedCharacter]);

  useEffect(() => {
    if (currentCharacter) {
      setCharacterValue((prev) => ({
        ...prev,
        imgUrl: currentCharacter?.img || "",
      }));

      const currentEmotion = currentCharacter.emotions.find((e) => e._id === characterEmotionId);
      setEmotionValue((prev) => ({
        ...prev,
        emotionName: currentEmotion?.emotionName || "",
        emotionImg: currentEmotion?.imgUrl || "",
      }));
    }
  }, [currentCharacter, characterEmotionId]);

  useEffect(() => {
    if (translatedQuestion && !question.trim().length) {
      translatedQuestion.translations?.map((tq) => {
        if (tq.textFieldName === "choiceQuestion") {
          setQuestion(tq.text);
        }
      });
    }
  }, [translatedQuestion]);

  return { allEmotions: currentCharacter?.emotions, setEmotionValue, setCharacterValue, emotionValue, characterValue };
}

import { useState } from "react";
import PlotfieldEmotionPromptMain, { EmotionValueTypes } from "../../Prompts/Emotions/PlotfieldEmotionPromptMain";
import ChoiceQuestionCharacterField from "./ChoiceQuestionCharacterField";
import { CharacterValueTypes } from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import { EmotionsTypes } from "../../../../../../../types/StoryData/Character/CharacterTypes";

type QuestionFieldCharacterAuthorSectionTypes = {
  isAuthor: boolean;
  choiceId: string;
  emotionValue: EmotionValueTypes;
  characterValue: CharacterValueTypes;
  allEmotions: EmotionsTypes[];
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionValueTypes>>;
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
  const [showAllEmotions, setShowAllEmotions] = useState(false);
  const [showAllCharacters, setShowAllCharacters] = useState(false);

  const theme = localStorage.getItem("theme");

  return (
    <>
      {isAuthor ? (
        <div className="flex-grow bg-secondary rounded-md shadow-md px-[1rem] py-[.5rem]">
          <h4 className="text-[1.4rem] text-text-light">Author</h4>
        </div>
      ) : (
        <>
          <ChoiceQuestionCharacterField
            choiceId={choiceId}
            showAllCharacters={showAllCharacters}
            characterValue={characterValue}
            setCharacterValue={setCharacterValue}
            setShowAllCharacters={setShowAllCharacters}
            setShowAllEmotions={setShowAllEmotions}
          />

          <div className="relative flex-grow">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllCharacters(false);
                setShowAllEmotions((prev) => !prev);
              }}
              className={`${
                theme === "light" ? "outline-gray-300" : "outline-gray-600"
              } text-text-light text-[1.4rem] w-full bg-secondary rounded-md shadow-md px-[1rem] py-[.5rem]`}
            >
              {emotionValue.emotionName?.trim().length ? (
                <div className="flex gap-[1rem] justify-between items-center">
                  <h4 className="text-[1.5rem] text-text-light">{emotionValue.emotionName}</h4>
                  <img
                    src={emotionValue.emotionImg || ""}
                    alt="EmotionIcon"
                    className={`${emotionValue.emotionImg ? "" : "hidden"} w-[3.5rem] rounded-md object-contain`}
                  />
                </div>
              ) : (
                "Эмоция"
              )}
            </button>
            <PlotfieldEmotionPromptMain
              setEmotionValue={setEmotionValue}
              emotionValue={emotionValue}
              allEmotions={allEmotions}
              setShowEmotionModal={setShowAllEmotions}
              showEmotionModal={showAllEmotions}
              modalPosition="left-0"
            />
          </div>
        </>
      )}
    </>
  );
}

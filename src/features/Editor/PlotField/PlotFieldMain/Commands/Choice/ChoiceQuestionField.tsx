import { useEffect, useState } from "react";
import plus from "../../../../../../assets/images/shared/add.png";
import useGetCharacterById from "../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import ButtonHoverPromptModal from "../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import useGetCommandChoiceTranslation from "../hooks/Choice/useGetCommandChoiceTranslation";
import useUpdateChoice from "../hooks/Choice/useUpdateChoice";
import PlotfieldCharacterPromptMain from "../Prompts/Characters/PlotfieldCharacterPromptMain";
import PlotfieldEmotionPromptMain from "../Prompts/Emotions/PlotfieldEmotionPromptMain";
import CreateChoiceOptionTypeModal from "./Option/CreateChoiceOptionTypeModal";
import useUpdateChoiceTranslation from "../../../../../../hooks/Patching/Translation/PlotfieldCoomands/useUpdateChoiceTranslation";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationTextFieldNameChoiceTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type ChoiceQuestionFieldTypes = {
  characterId: string;
  characterEmotionId: string;
  isAuthor: boolean;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  choiceId: string;
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function ChoiceQuestionField({
  characterId,
  characterEmotionId,
  isAuthor,
  choiceId,
  setCharacterId,
  topologyBlockId,
  plotFieldCommandId,
}: ChoiceQuestionFieldTypes) {
  const [initialCharacterId] = useState(characterId);
  const [initialCharacterEmotionId] = useState(characterEmotionId);
  const [initialQuestion, setInitialQuestion] = useState("");

  const [showCreateChoiceOptionModal, setShowCreateChoiceOptionModal] =
    useState(false);

  const { data: translatedQuestion } = useGetCommandChoiceTranslation({
    commandId: plotFieldCommandId,
  });

  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (translatedQuestion && !question.trim().length) {
      translatedQuestion.translations?.map((tq) => {
        if (tq.textFieldName === "choiceQuestion") {
          setQuestion(tq.text);
          setInitialQuestion(tq.text);
        }
      });
    }
  }, [translatedQuestion]);

  const [showAllCharacters, setShowAllCharacters] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [characterImg, setCharacterImg] = useState<string>("");

  const { data: translatedCharacter } = useGetTranslationCharacterById({
    characterId,
    language: "russian",
  });
  const { data: currentCharacter } = useGetCharacterById({ characterId });

  useEffect(() => {
    if (translatedCharacter) {
      translatedCharacter.translations?.map((tc) => {
        if (tc.textFieldName === "characterName") {
          setCharacterName(tc.text || "");
        }
      });
    }
  }, [translatedCharacter]);

  useEffect(() => {
    if (currentCharacter) {
      setCharacterImg(currentCharacter?.img || "");
    }
  }, [currentCharacter]);

  const [showAllEmotions, setShowAllEmotions] = useState(false);
  const [emotionName, setEmotionName] = useState("");
  const [emotionId, setEmotionId] = useState("");
  const [emotionImg, setEmotionImg] = useState<string>("");

  useEffect(() => {
    if (currentCharacter) {
      const currentEmotion = currentCharacter.emotions.find(
        (e) => e._id === characterEmotionId
      );
      setEmotionName(currentEmotion?.emotionName || "");
      setEmotionImg(currentEmotion?.imgUrl || "");
    }
  }, [currentCharacter, characterEmotionId]);

  const updateChoice = useUpdateChoice({ choiceId });

  const updateChoiceTranslation = useUpdateChoiceTranslation({
    commandId: plotFieldCommandId,
    language: "russian",
    topologyBlockId,
  });

  const debouncedValue = useDebounce({ value: question, delay: 700 });

  useEffect(() => {
    if (initialQuestion !== debouncedValue && debouncedValue?.trim().length) {
      updateChoiceTranslation.mutate({
        text: question,
        textFieldName:
          TranslationTextFieldName.ChoiceQuestion as TranslationTextFieldNameChoiceTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    if (initialCharacterId !== characterId && characterId?.trim().length) {
      updateChoice.mutate({ characterId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  useEffect(() => {
    if (initialCharacterEmotionId !== emotionId && emotionId?.trim().length) {
      updateChoice.mutate({ characterEmotionId: emotionId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emotionId]);

  const characterDebouncedValue = useDebounce({
    value: characterName,
    delay: 500,
  });
  return (
    <div className="w-full flex-grow flex gap-[1rem] bg-neutral-magnolia rounded-md shadow-md p-[.5rem] flex-wrap items-center z-[20]">
      {isAuthor ? (
        <div className="flex-grow bg-white rounded-md shadow-md px-[1rem] py-[.5rem]">
          <h4 className="text-[1.4rem] text-gray-700">Author</h4>
        </div>
      ) : (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowAllCharacters(false);
            }}
            className="w-full relative flex gap-[.5rem] items-center bg-primary-light-blue rounded-md"
          >
            <input
              onClick={(e) => {
                e.stopPropagation();
                setShowAllCharacters(true);
                setShowAllEmotions(false);
              }}
              value={characterName}
              onChange={(e) => {
                setShowAllCharacters(true);
                setCharacterName(e.target.value);
              }}
              placeholder="Имя Персонажа"
              className="flex-grow text-[1.4rem] outline-gray-300 bg-white rounded-md px-[1rem] py-[.5rem] shadow-md"
            />

            <img
              src={characterImg}
              alt="CharacterImg"
              className={`${
                characterImg?.trim().length ? "" : "hidden"
              } w-[4rem] object-cover rounded-md self-end`}
            />
            <PlotfieldCharacterPromptMain
              characterDebouncedValue={characterDebouncedValue}
              setCharacterId={setCharacterId}
              setCharacterName={setCharacterName}
              setShowCharacterModal={setShowAllCharacters}
              showCharacterModal={showAllCharacters}
              setCharacterImg={setCharacterImg}
            />
          </form>

          <div className="relative flex-grow">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllCharacters(false);
                setShowAllEmotions((prev) => !prev);
              }}
              className="outline-gray-300 text-[1.3rem] w-full bg-white rounded-md shadow-md px-[1rem] py-[.5rem]"
            >
              {emotionName?.trim().length ? (
                <div className="flex gap-[1rem] justify-between items-center">
                  <h4 className="text-[1.5rem]">{emotionName}</h4>
                  <img
                    src={emotionImg}
                    alt="EmotionIcon"
                    className={`${
                      emotionImg ? "" : "hidden"
                    } w-[3.5rem] rounded-md object-contain`}
                  />
                </div>
              ) : (
                "Эмоция"
              )}
            </button>
            <PlotfieldEmotionPromptMain
              emotionName={emotionName}
              allEmotions={currentCharacter?.emotions}
              setEmotionImg={setEmotionImg}
              setEmotionName={setEmotionName}
              setEmotionId={setEmotionId}
              setShowEmotionModal={setShowAllEmotions}
              showEmotionModal={showAllEmotions}
              modalPosition="left-0"
            />
          </div>
        </>
      )}

      <form className="flex-grow" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Вопрос"
          className="w-full px-[1rem] py-[.5rem] outline-gray-300 bg-white rounded-md shadow-md text-gray-600 text-[1.4rem]"
        />
      </form>

      <div className="relative ml-auto">
        <ButtonHoverPromptModal
          onClick={(e) => {
            e.stopPropagation();
            setShowCreateChoiceOptionModal((prev) => !prev);
          }}
          variant={"rectangle"}
          contentName="Создать Ответ"
          positionByAbscissa="right"
          asideClasses="text-[1.4rem] text-gray-700"
          className="bg-white rounded-md shadow-md p-[.2rem]"
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

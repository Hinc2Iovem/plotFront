import { useEffect, useState } from "react";
import plus from "../../../../../../assets/images/shared/add.png";
import useGetCharacterById from "../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import ButtonHoverPromptModal from "../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import useGetCommandChoiceTranslation from "../../../hooks/Choice/useGetCommandChoiceTranslation";
import useUpdateChoice from "../../../hooks/Choice/useUpdateChoice";
import PlotfieldCharacterPromptMain from "../Prompts/Characters/PlotfieldCharacterPromptMain";
import PlotfieldEmotionPromptMain from "../Prompts/Emotions/PlotfieldEmotionPromptMain";
import CreateChoiceOptionTypeModal from "./Option/CreateChoiceOptionTypeModal";
import useUpdateChoiceTranslation from "../../../../../../hooks/Patching/Translation/PlotfieldCoomands/useUpdateChoiceTranslation";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationTextFieldNameChoiceTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import TextSettingsModal from "../../../../components/TextSettingsModal";
import { TextStyleTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { checkTextStyle } from "../../../utils/checkTextStyleTextSide";
import useSearch from "../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";

type ChoiceQuestionFieldTypes = {
  characterId: string;
  characterEmotionId: string;
  isAuthor: boolean;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
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
  setCharacterId,
  topologyBlockId,
  plotFieldCommandId,
  textStyle,
}: ChoiceQuestionFieldTypes) {
  const { episodeId } = useParams();
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [currentTextStyle, setCurrentTextStyle] = useState(textStyle);
  const [initialCharacterEmotionId] = useState(characterEmotionId);

  const [showCreateChoiceOptionModal, setShowCreateChoiceOptionModal] = useState(false);

  const { data: translatedQuestion } = useGetCommandChoiceTranslation({
    commandId: plotFieldCommandId,
  });

  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (translatedQuestion && !question.trim().length) {
      translatedQuestion.translations?.map((tq) => {
        if (tq.textFieldName === "choiceQuestion") {
          setQuestion(tq.text);
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
  const theme = localStorage.getItem("theme");

  useEffect(() => {
    if (currentCharacter) {
      const currentEmotion = currentCharacter.emotions.find((e) => e._id === characterEmotionId);
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
    if (debouncedValue?.trim().length) {
      updateChoiceTranslation.mutate({
        text: question,
        textFieldName: TranslationTextFieldName.ChoiceQuestion as TranslationTextFieldNameChoiceTypes,
      });

      checkTextStyle({ debouncedValue, setCurrentTextStyle });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    if (initialCharacterEmotionId !== emotionId && emotionId?.trim().length) {
      updateChoice.mutate({ characterEmotionId: emotionId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emotionId]);

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: "Choice",
          id: plotFieldCommandId,
          text: isAuthor ? question : `${characterName} ${question}`,
          topologyBlockId,
          type: "command",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Choice",
        id: plotFieldCommandId,
        value: isAuthor ? debouncedValue : `${characterName} ${debouncedValue}`,
        type: "command",
      });
    }
  }, [characterName, debouncedValue, episodeId]);

  return (
    <div className="w-full flex-grow flex gap-[1rem] bg-primary rounded-md shadow-md p-[.5rem] flex-wrap items-center">
      {isAuthor ? (
        <div className="flex-grow bg-secondary rounded-md shadow-md px-[1rem] py-[.5rem]">
          <h4 className="text-[1.4rem] text-text-light">Author</h4>
        </div>
      ) : (
        <>
          <ChoiceQuestionCharacterField
            characterId={characterId}
            choiceId={choiceId}
            showAllCharacters={showAllCharacters}
            characterImg={characterImg}
            characterName={characterName}
            setCharacterId={setCharacterId}
            setCharacterImg={setCharacterImg}
            setCharacterName={setCharacterName}
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
              {emotionName?.trim().length ? (
                <div className="flex gap-[1rem] justify-between items-center">
                  <h4 className="text-[1.5rem] text-text-light">{emotionName}</h4>
                  <img
                    src={emotionImg}
                    alt="EmotionIcon"
                    className={`${emotionImg ? "" : "hidden"} w-[3.5rem] rounded-md object-contain`}
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

      <form className="flex-grow relative" onSubmit={(e) => e.preventDefault()}>
        <PlotfieldInput
          type="text"
          focusedSecondTime={focusedSecondTime}
          onBlur={() => {
            setFocusedSecondTime(false);
          }}
          setFocusedSecondTime={setFocusedSecondTime}
          value={question}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowSettingsModal((prev) => !prev);
          }}
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

type ChoiceQuestionCharacterFieldTypes = {
  setShowAllCharacters: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAllEmotions: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterName: React.Dispatch<React.SetStateAction<string>>;
  setCharacterImg: React.Dispatch<React.SetStateAction<string>>;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  showAllCharacters: boolean;
  characterName: string;
  characterImg: string;
  characterId: string;
  choiceId: string;
};

export type DebouncedCheckCharacterTypes = {
  characterId: string;
  characterImg?: string;
  characterName: string;
};

function ChoiceQuestionCharacterField({
  showAllCharacters,
  characterName,
  characterImg,
  characterId,
  choiceId,
  setShowAllCharacters,
  setShowAllEmotions,
  setCharacterName,
  setCharacterImg,
  setCharacterId,
}: ChoiceQuestionCharacterFieldTypes) {
  const [initialCharacterId] = useState(characterId);
  const [debouncedCharacter, setDebouncedCharacter] = useState<DebouncedCheckCharacterTypes | null>(null);
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const debouncedValue = useDebounce({ value: characterName, delay: 700 });

  const updateChoice = useUpdateChoice({ choiceId });

  useEffect(() => {
    if (initialCharacterId !== characterId && characterId?.trim().length) {
      updateChoice.mutate({ characterId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  useEffect(() => {
    if (debouncedCharacter) {
      setCharacterId(debouncedCharacter?.characterId);
      setCharacterImg(debouncedCharacter?.characterImg || "");
    }
  }, [debouncedCharacter]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setShowAllCharacters(false);
      }}
      className="w-full relative flex gap-[.5rem] bg-primary rounded-md"
    >
      <PlotfieldInput
        focusedSecondTime={focusedSecondTime}
        onBlur={() => {
          setFocusedSecondTime(false);
        }}
        setFocusedSecondTime={setFocusedSecondTime}
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
      />

      <img
        src={characterImg}
        alt="CharacterImg"
        className={`${
          characterImg?.trim().length ? "" : "hidden"
        } w-[3rem] object-cover top-[1.5px] rounded-md right-0 absolute`}
      />
      <PlotfieldCharacterPromptMain
        characterValue={characterName}
        setCharacterId={setCharacterId}
        setCharacterName={setCharacterName}
        setShowCharacterModal={setShowAllCharacters}
        showCharacterModal={showAllCharacters}
        setCharacterImg={setCharacterImg}
        translateAsideValue={"translate-y-[3.5rem]"}
        debouncedValue={debouncedValue}
        setDebouncedCharacter={setDebouncedCharacter}
        commandIfId=""
        isElse={false}
      />
    </form>
  );
}

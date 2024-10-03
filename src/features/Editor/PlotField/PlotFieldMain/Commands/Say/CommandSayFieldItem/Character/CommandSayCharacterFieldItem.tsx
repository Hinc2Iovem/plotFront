import { useEffect, useState } from "react";
import useGetCharacterById from "../../../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import "../../../../../../Flowchart/FlowchartStyles.css";
import useGetTranslationSayEnabled from "../../../hooks/Say/useGetTranslationSayEnabled";
import useUpdateCommandSayText from "../../../hooks/Say/useUpdateCommandSayText";
import FormCharacter from "./FormCharacter";
import FormEmotion from "./FormEmotion";

type CommandSayCharacterFieldItemTypes = {
  nameValue: string;
  setNameValue: React.Dispatch<React.SetStateAction<string>>;
  characterEmotionId: string;
  plotFieldCommandSayId: string;
  characterId: string;
  topologyBlockId: string;
  plotFieldCommandId: string;
};

export default function CommandSayCharacterFieldItem({
  nameValue,
  setNameValue,
  characterEmotionId,
  plotFieldCommandSayId,
  characterId,
  plotFieldCommandId,
  topologyBlockId,
}: CommandSayCharacterFieldItemTypes) {
  const { data: currentCharacter } = useGetCharacterById({ characterId });
  const [initialValue, setInitialValue] = useState("");
  const [showCreateCharacterModal, setShowCreateCharacterModal] =
    useState(false);
  const [showCreateEmotionModal, setShowCreateEmotionModal] = useState(false);
  const [emotionValue, setEmotionValue] = useState<EmotionsTypes | null>(null);

  const [textValue, setTextValue] = useState("");

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const { data: translatedSayText } = useGetTranslationSayEnabled({
    commandId: plotFieldCommandId,
  });

  useEffect(() => {
    if (translatedSayText && !textValue.trim().length) {
      setTextValue((translatedSayText.translations || [])[0]?.text || "");
      setInitialValue((translatedSayText.translations || [])[0]?.text || "");
    }
  }, [translatedSayText]);

  useEffect(() => {
    if (currentCharacter && !emotionValue?.emotionName.trim().length) {
      setEmotionValue(
        currentCharacter.emotions.find((e) => e._id === characterEmotionId) ||
          null
      );
    }
  }, [currentCharacter, characterId]);

  useEffect(() => {
    if (showCreateCharacterModal) {
      setShowCreateEmotionModal(false);
    } else if (showCreateEmotionModal) {
      setShowCreateCharacterModal(false);
    }
  }, [showCreateEmotionModal, showCreateCharacterModal]);

  const updateCommandSayText = useUpdateCommandSayText({
    commandId: plotFieldCommandId,
    textValue,
    topologyBlockId,
  });

  useEffect(() => {
    if (initialValue !== debouncedValue && debouncedValue?.trim().length) {
      updateCommandSayText.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const [showCharacters, setShowCharacters] = useState(false);
  const [showAllEmotions, setShowAllEmotions] = useState(false);

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-light-blue rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="flex flex-col gap-[1rem] sm:w-1/3 min-w-[20rem] w-full">
        <FormCharacter
          nameValue={nameValue}
          setNameValue={setNameValue}
          setEmotionValue={setEmotionValue}
          plotFieldCommandId={plotFieldCommandId}
          plotFieldCommandSayId={plotFieldCommandSayId}
          setShowCreateCharacterModal={setShowCreateCharacterModal}
          showCreateCharacterModal={showCreateCharacterModal}
          setShowCharacters={setShowCharacters}
          setShowAllEmotions={setShowAllEmotions}
          showCharacters={showCharacters}
        />
        <FormEmotion
          setEmotionValue={setEmotionValue}
          emotionValue={emotionValue}
          emotions={currentCharacter?.emotions || []}
          characterId={characterId}
          plotFieldCommandId={plotFieldCommandId}
          plotFieldCommandSayId={plotFieldCommandSayId}
          setShowCreateEmotionModal={setShowCreateEmotionModal}
          showCreateEmotionModal={showCreateEmotionModal}
          setShowAllEmotions={setShowAllEmotions}
          setShowCharacters={setShowCharacters}
          showAllEmotions={showAllEmotions}
        />
      </div>
      <form className="sm:w-[57%] flex-grow w-full sm:h-full">
        <textarea
          value={textValue}
          className="h-full w-full outline-gray-300 text-gray-600 text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[25rem] containerScroll"
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}

import { useEffect } from "react";
import useSearch from "../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetTranslationSayEnabled from "../../../../../hooks/Say/get/useGetTranslationSayEnabled";
import useGetCharacterById from "../../../../../../../../hooks/Fetching/Character/useGetCharacterById";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import { CharacterValueTypes, EmotionTypes } from "./CommandSayCharacterFieldItem";

type PrepareInitialStateCommandSayTypes = {
  characterId: string;
  plotFieldCommandId: string;
  characterName: string;
  emotionName: string;
  textValue: string;
  topologyBlockId: string;
  episodeId: string;
  emotionId: string;
  emotionImg?: string;
  characterImg?: string;
  setInitTextValue: React.Dispatch<React.SetStateAction<string>>;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  setAllEmotions: React.Dispatch<React.SetStateAction<EmotionsTypes[]>>;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionTypes>>;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
};

export default function usePrepareInitialStateCommandSay({
  characterId,
  characterName,
  topologyBlockId,
  textValue,
  emotionName,
  plotFieldCommandId,
  setAllEmotions,
  setInitTextValue,
  setTextValue,
  setCharacterValue,
  setEmotionValue,
  characterImg,
  emotionImg,
  episodeId,
  emotionId,
}: PrepareInitialStateCommandSayTypes) {
  const { updateCharacterProperties, updateEmotionProperties, getCommandByPlotfieldCommandId } = usePlotfieldCommands();

  const { data: currentCharacter } = useGetCharacterById({
    characterId,
  });

  const { data: translatedSayText } = useGetTranslationSayEnabled({
    commandId: plotFieldCommandId,
  });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "character",
    id: plotFieldCommandId,
    text: `${characterName} ${emotionName} ${textValue}`,
    topologyBlockId,
    type: "command",
  });

  useEffect(() => {
    if (translatedSayText && !textValue.trim().length) {
      setTextValue((translatedSayText.translations || []).find((ts) => ts.textFieldName === "sayText")?.text || "");
      setInitTextValue((translatedSayText.translations || []).find((ts) => ts.textFieldName === "sayText")?.text || "");
    }
  }, [translatedSayText]);

  useEffect(() => {
    if (currentCharacter) {
      updateCharacterProperties({
        characterId,
        characterName:
          getCommandByPlotfieldCommandId({
            plotfieldCommandId: plotFieldCommandId,
            topologyBlockId,
          })?.characterName || "",
        id: plotFieldCommandId,
        characterImg: currentCharacter?.img || characterImg || "",
      });

      setCharacterValue((prev) => ({
        _id: currentCharacter._id || prev._id,
        characterName: prev.characterName ? prev.characterName : characterName,
        imgUrl: currentCharacter?.img || characterImg || prev.imgUrl,
      }));

      const currentEmotion = currentCharacter.emotions.find((e) => e._id === emotionId);

      setAllEmotions(currentCharacter?.emotions);

      if (currentEmotion) {
        setEmotionValue({
          _id: currentEmotion._id,
          emotionName: currentEmotion?.emotionName || null,
          imgUrl: currentEmotion?.imgUrl || null,
        });
        updateEmotionProperties({
          emotionId: emotionId || "",
          emotionName: currentEmotion?.emotionName || emotionName || "",
          emotionImg: currentEmotion?.imgUrl || emotionImg || "",
          id: plotFieldCommandId,
        });
      }

      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "character",
          id: plotFieldCommandId,
          type: "command",
          value: `${characterName} ${emotionName} ${textValue}`,
        });
      }
    }
  }, [currentCharacter, characterId]);
}

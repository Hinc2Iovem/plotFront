import { useEffect, useRef, useState } from "react";
import useGetCharacterById from "../../../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { TextStyleTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CommandSideTypes } from "../../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import PlotfieldTextarea from "../../../../../../../shared/Textareas/PlotfieldTextarea";
import TextSettingsModal from "../../../../../../components/TextSettingsModal";
import "../../../../../../Flowchart/FlowchartStyles.css";
import useGetTranslationSayEnabled from "../../../../../hooks/Say/useGetTranslationSayEnabled";
import useUpdateCommandSayText from "../../../../../hooks/Say/useUpdateCommandSayText";
import useUpdateSayTextSide from "../../../../../hooks/Say/useUpdateSayTextSide";
import useUpdateSayTextStyle from "../../../../../hooks/Say/useUpdateSayTextStyle";
import { checkTextSide, checkTextStyle } from "../../../../../utils/checkTextStyleTextSide";
import FormCharacter from "./FormCharacter";
import FormEmotion from "./FormEmotion";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import useFocuseOnCurrentFocusedFieldChange from "../../../../../../../../hooks/helpers/Plotfield/useFocuseOnCurrentFocusedFieldChange";
import useCheckIsCurrentFieldFocused from "../../../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import useSearch from "../../../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";

type CommandSayCharacterFieldItemTypes = {
  plotFieldCommandSayId: string;
  topologyBlockId: string;
  plotFieldCommandId: string;
  emotionName?: string;
  emotionImg?: string;
  characterImg?: string;
  currentCharacterId: string;
  currentEmotionId: string;
  textStyle: TextStyleTypes;
  textSide: CommandSideTypes;
  characterName: string;

  commandIfId?: string;
  isElse?: boolean;
};

export type EmotionTypes = {
  _id: string | null;
  emotionName: string | null;
  imgUrl: string | null;
};

export type CharacterValueTypes = {
  _id: string | null;
  characterName: string | null;
  imgUrl: string | null;
};

export default function CommandSayCharacterFieldItem({
  plotFieldCommandSayId,
  plotFieldCommandId,
  topologyBlockId,
  textSide,
  textStyle,
  emotionName,
  emotionImg,
  characterImg,
  currentCharacterId,
  currentEmotionId,
  characterName,

  commandIfId,
  isElse,
}: CommandSayCharacterFieldItemTypes) {
  const { episodeId } = useParams();
  const {
    updateCharacterProperties,
    updateEmotionProperties,
    getCommandByPlotfieldCommandId,
    updateCommandSide,

    updateCommandIfSide,
    updateCharacterPropertiesIf,
    updateEmotionPropertiesIf,
    getCommandIfByPlotfieldCommandId,
  } = usePlotfieldCommands();

  const [currentTextStyle, setCurrentTextStyle] = useState(textStyle);
  const [currentTextSide, setCurrentTextSide] = useState(textSide);
  const [showTextSettingsModal, setShowTextSettingsModal] = useState(false);

  const [emotionValue, setEmotionValue] = useState<EmotionTypes>({
    _id: currentEmotionId || null,
    emotionName: emotionName || null,
    imgUrl: emotionImg || null,
  });

  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>({
    _id: currentCharacterId,
    characterName: null,
    imgUrl: null,
  });

  const { data: currentCharacter } = useGetCharacterById({
    characterId: characterValue?._id ? characterValue._id : currentCharacterId,
  });

  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });

  const currentInput = useRef<HTMLTextAreaElement | null>(null);
  useFocuseOnCurrentFocusedFieldChange({ currentInput, isCommandFocused });

  const [showCreateCharacterModal, setShowCreateCharacterModal] = useState(false);
  const [showCreateEmotionModal, setShowCreateEmotionModal] = useState(false);

  const [textValue, setTextValue] = useState("");

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const { data: translatedSayText } = useGetTranslationSayEnabled({
    commandId: plotFieldCommandId,
  });
  const [allEmotions, setAllEmotions] = useState<EmotionsTypes[]>([]);

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: "character",
          id: plotFieldCommandId,
          text: `${characterValue.characterName} ${emotionValue.emotionName} ${debouncedValue}`,
          topologyBlockId,
          type: "command",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (translatedSayText && !textValue.trim().length) {
      setTextValue((translatedSayText.translations || []).find((ts) => ts.textFieldName === "sayText")?.text || "");
    }
  }, [translatedSayText]);

  useEffect(() => {
    if (currentCharacter) {
      if (commandIfId?.trim().length) {
        updateCharacterPropertiesIf({
          characterId: currentCharacterId,
          characterName:
            getCommandIfByPlotfieldCommandId({
              plotfieldCommandId: plotFieldCommandId,
              commandIfId,
              isElse: isElse || false,
            })?.characterName || "",
          id: plotFieldCommandId,
          characterImg: currentCharacter?.img || characterImg || "",
          isElse: isElse || false,
        });
      } else {
        updateCharacterProperties({
          characterId: currentCharacterId,
          characterName:
            getCommandByPlotfieldCommandId({
              plotfieldCommandId: plotFieldCommandId,
              topologyBlockId,
            })?.characterName || "",
          id: plotFieldCommandId,
          characterImg: currentCharacter?.img || characterImg || "",
        });
      }

      setCharacterValue((prev) => ({
        _id: prev._id,
        characterName: prev.characterName ? prev.characterName : characterName,
        imgUrl: currentCharacter?.img || characterImg || "",
      }));

      const currentEmotion = currentCharacter.emotions.find((e) => e._id === emotionValue._id);

      setAllEmotions(currentCharacter?.emotions);

      if (currentEmotion) {
        setEmotionValue({
          _id: currentEmotion._id,
          emotionName: currentEmotion?.emotionName || null,
          imgUrl: currentEmotion?.imgUrl || null,
        });

        if (commandIfId?.trim().length) {
          updateEmotionPropertiesIf({
            emotionId: emotionValue._id || "",
            emotionName: currentEmotion?.emotionName || emotionName || "",
            emotionImg: currentEmotion?.imgUrl || emotionImg || "",
            id: plotFieldCommandId,
            isElse: isElse || false,
          });
        } else {
          updateEmotionProperties({
            emotionId: emotionValue._id || "",
            emotionName: currentEmotion?.emotionName || emotionName || "",
            emotionImg: currentEmotion?.imgUrl || emotionImg || "",
            id: plotFieldCommandId,
          });
        }
      }

      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "character",
          id: plotFieldCommandId,
          type: "command",
          value: `${characterValue.characterName} ${emotionValue.emotionName} ${debouncedValue}`,
        });
      }
    }
  }, [currentCharacter]);

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
    if (debouncedValue?.trim().length) {
      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "character",
          id: plotFieldCommandId,
          type: "command",
          value: `${characterValue.characterName} ${emotionValue.emotionName} ${debouncedValue}`,
        });
      }
      updateCommandSayText.mutate();
      checkTextStyle({ debouncedValue, setCurrentTextStyle });
      checkTextSide({
        debouncedValue,
        setCurrentTextSide,
        plotfieldCommandId: plotFieldCommandId,
        updateCommandSide,
        commandIfId: commandIfId || "",
        isElse: isElse || false,
        updateCommandIfSide,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const [showCharacters, setShowCharacters] = useState(false);
  const [showAllEmotions, setShowAllEmotions] = useState(false);

  const updateCommandSaySide = useUpdateSayTextSide({
    sayId: plotFieldCommandSayId,
  });

  useEffect(() => {
    if (currentTextSide && plotFieldCommandSayId?.trim().length) {
      updateCommandSaySide.mutate({ textSide: currentTextSide });
    }
  }, [currentTextSide]);

  const updateCommandSayStyle = useUpdateSayTextStyle({
    sayId: plotFieldCommandSayId,
  });

  useEffect(() => {
    if (currentTextStyle && plotFieldCommandSayId?.trim().length) {
      updateCommandSayStyle.mutate({ textStyle: currentTextStyle });
    }
  }, [currentTextStyle]);

  return (
    <div className="flex flex-wrap gap-[1rem] w-full h-fit bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="flex flex-col gap-[1rem] sm:w-1/3 min-w-[20rem] w-full flex-grow">
        <FormCharacter
          initialCharacterId={currentCharacterId}
          topologyBlockId={topologyBlockId}
          plotFieldCommandId={plotFieldCommandId}
          plotFieldCommandSayId={plotFieldCommandSayId}
          setShowCreateCharacterModal={setShowCreateCharacterModal}
          showCreateCharacterModal={showCreateCharacterModal}
          setShowCharacters={setShowCharacters}
          setShowAllEmotions={setShowAllEmotions}
          showCharacters={showCharacters}
          setEmotionValue={setEmotionValue}
          characterValue={characterValue}
          setCharacterValue={setCharacterValue}
          commandIfId={commandIfId || ""}
          isElse={isElse || false}
        />
        <FormEmotion
          emotionValue={emotionValue}
          emotions={allEmotions}
          plotFieldCommandId={plotFieldCommandId}
          initialEmotionId={currentEmotionId}
          setEmotionValue={setEmotionValue}
          plotFieldCommandSayId={plotFieldCommandSayId}
          setShowCreateEmotionModal={setShowCreateEmotionModal}
          showCreateEmotionModal={showCreateEmotionModal}
          setShowAllEmotions={setShowAllEmotions}
          setShowCharacters={setShowCharacters}
          showAllEmotions={showAllEmotions}
          characterId={characterValue._id || ""}
          commandIfId={commandIfId || ""}
          isElse={isElse || false}
        />
      </div>
      <form className="sm:w-[57%] flex-grow w-full h-full relative">
        <PlotfieldTextarea
          value={textValue}
          ref={currentInput}
          placeholder="Such a lovely day"
          onContextMenu={(e) => {
            e.preventDefault();
            setShowTextSettingsModal((prev) => !prev);
          }}
          className={`${
            currentTextStyle === "underscore"
              ? "underline"
              : currentTextStyle === "bold"
              ? "font-bold"
              : currentTextStyle === "italic"
              ? "italic"
              : ""
          } ${currentTextSide === "right" ? "text-right" : "text-left"} h-full min-h-[7.5rem]`}
          onChange={(e) => setTextValue(e.target.value)}
        />

        <TextSettingsModal
          translateY="translate-y-[-15rem]"
          setShowModal={setShowTextSettingsModal}
          currentTextStyle={currentTextStyle}
          setCurrentTextStyle={setCurrentTextStyle}
          showModal={showTextSettingsModal}
          showTextSideRow={true}
          showTextStyleRow={true}
          setTextValue={setTextValue}
          plotfieldCommandId={plotFieldCommandId}
          setCurrentTextSide={setCurrentTextSide}
          currentSide={currentTextSide}
          isElse={isElse}
        />
      </form>
    </div>
  );
}

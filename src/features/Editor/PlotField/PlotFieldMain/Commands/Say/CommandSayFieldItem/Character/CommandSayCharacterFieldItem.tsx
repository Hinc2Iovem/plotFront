import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import { TextStyleTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CommandSideTypes } from "../../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import "../../../../../../Flowchart/FlowchartStyles.css";
import FormCharacter from "./FormCharacter";
import FormEmotion from "./FormEmotion";
import SayCharacterFieldItemTextArea from "./SayCharacterFieldItemTextArea";
import usePrepareInitialStateCommandSay from "./usePrepareInitialStateCommandSay";

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
}: CommandSayCharacterFieldItemTypes) {
  const { episodeId } = useParams();

  const [currentTextStyle, setCurrentTextStyle] = useState(textStyle);
  const [currentTextSide, setCurrentTextSide] = useState(textSide);

  const [emotionValue, setEmotionValue] = useState<EmotionTypes>({
    _id: currentEmotionId || null,
    emotionName: emotionName || null,
    imgUrl: emotionImg || null,
  });

  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>({
    _id: currentCharacterId || null,
    characterName: characterName || null,
    imgUrl: characterImg || null,
  });

  const [showCreateCharacterModal, setShowCreateCharacterModal] = useState(false);
  const [showCreateEmotionModal, setShowCreateEmotionModal] = useState(false);

  const [textValue, setTextValue] = useState("");

  const [allEmotions, setAllEmotions] = useState<EmotionsTypes[]>([]);

  usePrepareInitialStateCommandSay({
    characterId: characterValue?._id ? characterValue._id : currentCharacterId,
    characterName: characterValue.characterName || "",
    emotionId: emotionValue._id || "",
    emotionName: emotionValue.emotionName || "",
    episodeId: episodeId || "",
    plotFieldCommandId,
    setAllEmotions,
    setCharacterValue,
    setEmotionValue,
    setTextValue,
    textValue,
    topologyBlockId,
    characterImg,
    emotionImg,
  });

  useEffect(() => {
    if (showCreateCharacterModal) {
      setShowCreateEmotionModal(false);
    } else if (showCreateEmotionModal) {
      setShowCreateCharacterModal(false);
    }
  }, [showCreateEmotionModal, showCreateCharacterModal]);

  const [showCharacters, setShowCharacters] = useState(false);
  const [showAllEmotions, setShowAllEmotions] = useState(false);

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
        />
      </div>

      <SayCharacterFieldItemTextArea
        characterName={typeof characterValue.characterName === "string" ? characterValue.characterName : ""}
        currentTextSide={currentTextSide}
        currentTextStyle={currentTextStyle}
        emotionName={typeof emotionValue.emotionName === "string" ? emotionValue.emotionName : ""}
        episodeId={episodeId || ""}
        plotFieldCommandSayId={plotFieldCommandSayId}
        plotFieldCommandId={plotFieldCommandId}
        setCurrentTextSide={setCurrentTextSide}
        setCurrentTextStyle={setCurrentTextStyle}
        setTextValue={setTextValue}
        textValue={textValue}
        topologyBlockId={topologyBlockId}
      />
    </div>
  );
}

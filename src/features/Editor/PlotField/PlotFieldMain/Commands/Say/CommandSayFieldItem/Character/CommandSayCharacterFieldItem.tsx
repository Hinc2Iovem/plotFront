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
  const [initTextValue, setInitTextValue] = useState("");

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
    setInitTextValue,
  });

  useEffect(() => {
    if (showCreateCharacterModal) {
      setShowCreateEmotionModal(false);
    } else if (showCreateEmotionModal) {
      setShowCreateCharacterModal(false);
    }
  }, [showCreateEmotionModal, showCreateCharacterModal]);

  return (
    <div className="flex flex-wrap gap-[5px] w-full h-full rounded-md p-[5px] sm:flex-row flex-col relative border-border border-[1px]">
      <div className="flex flex-col gap-[5px] md:w-[300px] w-full">
        <FormCharacter
          plotFieldCommandId={plotFieldCommandId}
          plotFieldCommandSayId={plotFieldCommandSayId}
          setShowCreateCharacterModal={setShowCreateCharacterModal}
          showCreateCharacterModal={showCreateCharacterModal}
          setEmotionValue={setEmotionValue}
          characterValue={characterValue}
          setCharacterValue={setCharacterValue}
        />

        <FormEmotion
          emotionValue={emotionValue}
          emotions={allEmotions}
          plotFieldCommandId={plotFieldCommandId}
          setEmotionValue={setEmotionValue}
          plotFieldCommandSayId={plotFieldCommandSayId}
          setShowCreateEmotionModal={setShowCreateEmotionModal}
          showCreateEmotionModal={showCreateEmotionModal}
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
        setInitTextValue={setInitTextValue}
        setTextValue={setTextValue}
        textValue={textValue}
        initTextValue={initTextValue}
        topologyBlockId={topologyBlockId}
      />
    </div>
  );
}

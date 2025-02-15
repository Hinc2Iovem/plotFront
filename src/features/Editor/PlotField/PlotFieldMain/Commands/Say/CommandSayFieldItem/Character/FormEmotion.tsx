import React from "react";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import "../../../../../../Flowchart/FlowchartStyles.css";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import useUpdateNameOrEmotion from "../../../../../hooks/Say/patch/useUpdateNameOrEmotion";
import EmotionPromptCreationWrapper from "../../../../components/EmotionPromptCreationWrapper/EmotionPromptCreationWrapper";
import { EmotionTypes } from "./CommandSayCharacterFieldItem";

type FormEmotionTypes = {
  plotFieldCommandSayId: string;
  plotFieldCommandId: string;
  characterId: string;
  emotions: EmotionsTypes[];
  emotionValue: EmotionTypes;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionTypes>>;
};

export default function FormEmotion({
  plotFieldCommandId,
  plotFieldCommandSayId,
  emotionValue,
  emotions,
  characterId,
  setEmotionValue,
}: FormEmotionTypes) {
  const { updateEmotionName, updateEmotionProperties } = usePlotfieldCommands();
  const updateNameOrEmotion = useUpdateNameOrEmotion({
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  const handleOnBlur = (value: EmotionTypes) => {
    updateEmotionName({
      emotionName: value?.emotionName || "",
      id: plotFieldCommandId,
    });

    updateEmotionProperties({
      emotionId: value?._id || "",
      emotionImg: value?.imgUrl || "",
      emotionName: value?.emotionName || "",
      id: plotFieldCommandId,
    });

    setEmotionValue(value);
    updateNameOrEmotion.mutate({ emotionBodyId: value._id || "" });
  };

  return (
    <div className={`bg-secondary w-full relative`}>
      <EmotionPromptCreationWrapper
        onBlur={(value) => handleOnBlur(value)}
        emotions={emotions}
        initEmotionValue={emotionValue}
        characterId={characterId}
      />
    </div>
  );
}

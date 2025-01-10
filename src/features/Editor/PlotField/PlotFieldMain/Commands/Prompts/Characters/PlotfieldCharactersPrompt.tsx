import { Button } from "@/components/ui/button";
import usePlotfieldCommands from "../../../../Context/PlotFieldContext";
import {
  CharacterValueTypes,
  EmotionTypes,
} from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import { forwardRef } from "react";

type EmotionCharacterNameTypes = {
  characterId: string;
  characterName: string;
  characterImg?: string;
  plotfieldCommandId?: string;
  currentCharacterId?: string;

  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  setEmotionValue?: React.Dispatch<React.SetStateAction<EmotionTypes>>;
};

const PlotfieldCharactersPrompt = forwardRef<HTMLButtonElement, EmotionCharacterNameTypes>(
  (
    {
      characterId,
      characterName,
      characterImg,
      plotfieldCommandId,
      currentCharacterId,
      setShowCharacterModal,
      setEmotionValue,
      setCharacterValue,
    },
    ref
  ) => {
    const { updateCharacterProperties } = usePlotfieldCommands();
    return (
      <>
        {characterImg ? (
          <Button
            ref={ref}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (currentCharacterId !== characterId && setEmotionValue) {
                setEmotionValue({ _id: null, emotionName: null, imgUrl: null });
              }

              setCharacterValue({
                _id: characterId,
                characterName: characterName,
                imgUrl: characterImg,
              });

              updateCharacterProperties({
                characterId,
                characterName,
                id: plotfieldCommandId || "",
                characterImg,
              });

              setShowCharacterModal(false);
            }}
            className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
          >
            <p className="text-[16px] rounded-md">
              {characterName.length > 20 ? characterName.substring(0, 20) + "..." : characterName}
            </p>
            <img src={characterImg || ""} alt="CharacterImg" className="w-[30px] rounded-md" />
          </Button>
        ) : (
          <Button
            ref={ref}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (currentCharacterId !== characterId && setEmotionValue) {
                setEmotionValue({ _id: null, emotionName: null, imgUrl: null });
              }
              setCharacterValue({
                _id: characterId,
                characterName: characterName,
                imgUrl: null,
              });
              updateCharacterProperties({
                characterId,
                characterName,
                id: plotfieldCommandId || "",
                characterImg,
              });

              setShowCharacterModal(false);
            }}
            className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
          >
            {characterName.length > 20 ? characterName.substring(0, 20) + "..." : characterName}
          </Button>
        )}
      </>
    );
  }
);

PlotfieldCharactersPrompt.displayName = "PlotfieldCharactersPrompt";

export default PlotfieldCharactersPrompt;

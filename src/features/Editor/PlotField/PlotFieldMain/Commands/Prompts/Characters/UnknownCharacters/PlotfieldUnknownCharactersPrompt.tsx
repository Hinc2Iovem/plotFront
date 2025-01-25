import { Button } from "@/components/ui/button";
import { UnknownCharacterValueTypes } from "./PlotfieldUnknownCharacterPromptMain";
import { forwardRef } from "react";

type EmotionCharacterNameTypes = {
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  characterId: string;
  characterUnknownName: string;
  characterName: string;
  characterImg?: string;
  setCharacterValue?: React.Dispatch<React.SetStateAction<UnknownCharacterValueTypes>>;
};

const PlotfieldUnknownCharactersPrompt = forwardRef<HTMLButtonElement, EmotionCharacterNameTypes>(
  (
    { characterId, characterUnknownName, characterImg, characterName, setShowCharacterModal, setCharacterValue },
    ref
  ) => {
    return (
      <>
        {characterImg ? (
          <Button
            ref={ref}
            type="button"
            onClick={(e) => {
              e.stopPropagation();

              setShowCharacterModal(false);
              if (setCharacterValue) {
                setCharacterValue({
                  characterId: characterId,
                  characterUnknownName: characterUnknownName,
                  characterImg: characterImg,
                  characterName: characterName,
                });
              }
            }}
            className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
          >
            <p className="text-[16px] rounded-md">
              {characterUnknownName.length > 20 ? characterUnknownName.substring(0, 20) + "..." : characterUnknownName}
            </p>
            <img src={characterImg || ""} alt="CharacterImg" className="w-[30px] rounded-md" />
          </Button>
        ) : (
          <Button
            ref={ref}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowCharacterModal(false);
              if (setCharacterValue) {
                setCharacterValue({
                  characterId: characterId,
                  characterUnknownName: characterUnknownName,
                  characterImg: "",
                  characterName: characterName,
                });
              }
            }}
            className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
          >
            {characterUnknownName.length > 20 ? characterUnknownName.substring(0, 20) + "..." : characterUnknownName}
          </Button>
        )}
      </>
    );
  }
);

PlotfieldUnknownCharactersPrompt.displayName = "PlotfieldUnknownCharactersPrompt";

export default PlotfieldUnknownCharactersPrompt;

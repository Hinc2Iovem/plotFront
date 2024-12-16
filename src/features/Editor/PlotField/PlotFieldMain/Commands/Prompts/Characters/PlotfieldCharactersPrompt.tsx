import usePlotfieldCommands from "../../../../Context/PlotFieldContext";
import {
  CharacterValueTypes,
  EmotionTypes,
} from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";

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

export default function PlotfieldCharactersPrompt({
  characterId,
  characterName,
  characterImg,
  plotfieldCommandId,
  currentCharacterId,

  setShowCharacterModal,
  setEmotionValue,
  setCharacterValue,
}: EmotionCharacterNameTypes) {
  const theme = localStorage.getItem("theme");
  const { updateCharacterProperties } = usePlotfieldCommands();
  return (
    <>
      {characterImg ? (
        <button
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
          className={`whitespace-nowrap w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } focus-within:bg-primary-darker focus-within:text-text-light flex-wrap rounded-md flex px-[1rem] py-[.5rem] items-center justify-between hover:bg-primary-darker hover:text-text-light text-text-dark transition-all `}
        >
          <p className="text-[1.3rem] rounded-md">
            {characterName.length > 20 ? characterName.substring(0, 20) + "..." : characterName}
          </p>
          <img src={characterImg || ""} alt="CharacterImg" className="w-[3rem] rounded-md" />
        </button>
      ) : (
        <button
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
          className={`whitespace-nowrap w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-start text-[1.3rem] focus-within:bg-primary-darker focus-within:text-text-light rounded-md px-[1rem] py-[1rem] hover:bg-primary-darker hover:text-text-light text-text-dark transition-all `}
        >
          {characterName.length > 20 ? characterName.substring(0, 20) + "..." : characterName}
        </button>
      )}
    </>
  );
}

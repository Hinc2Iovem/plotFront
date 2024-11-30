import { UnknownCharacterValueTypes } from "./PlotfieldUnknownCharacterPromptMain";

type EmotionCharacterNameTypes = {
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  characterId: string;
  characterUnknownName: string;
  characterName: string;
  characterImg?: string;
  setCharacterValue?: React.Dispatch<React.SetStateAction<UnknownCharacterValueTypes>>;
};

export default function PlotfieldUnknownCharactersPrompt({
  characterId,
  characterUnknownName,
  characterImg,
  characterName,
  setShowCharacterModal,
  setCharacterValue,
}: EmotionCharacterNameTypes) {
  const theme = localStorage.getItem("theme");
  return (
    <>
      {characterImg ? (
        <button
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
          className={`whitespace-nowrap w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } focus-within:bg-primary-darker focus-within:text-text-light flex-wrap rounded-md flex px-[1rem] py-[.5rem] items-center justify-between hover:bg-primary-darker hover:text-text-light text-text-dark transition-all `}
        >
          <p className="text-[1.3rem] rounded-md">
            {characterUnknownName.length > 20 ? characterUnknownName.substring(0, 20) + "..." : characterUnknownName}
          </p>
          <img src={characterImg || ""} alt="CharacterImg" className="w-[3rem] rounded-md" />
        </button>
      ) : (
        <button
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
          className={`whitespace-nowrap w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-start text-[1.3rem] focus-within:bg-primary-darker focus-within:text-text-light rounded-md px-[1rem] py-[1rem] hover:bg-primary-darker hover:text-text-light text-text-dark transition-all `}
        >
          {characterUnknownName.length > 20 ? characterUnknownName.substring(0, 20) + "..." : characterUnknownName}
        </button>
      )}
    </>
  );
}

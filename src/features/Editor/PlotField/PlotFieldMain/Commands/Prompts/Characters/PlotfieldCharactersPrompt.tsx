type EmotionCharacterNameTypes = {
  setCharacterName: React.Dispatch<React.SetStateAction<string>>;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  setCharacterImg?: React.Dispatch<React.SetStateAction<string>>;
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setNewlyCreated: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  characterId: string;
  characterName: string;
  characterImg?: string;
};

export default function PlotfieldCharactersPrompt({
  characterId,
  characterName,
  characterImg,
  setCharacterName,
  setCharacterId,
  setShowCharacterModal,
  setCharacterImg,
  setNewlyCreated,
}: EmotionCharacterNameTypes) {
  const theme = localStorage.getItem("theme");

  return (
    <>
      {characterImg ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setCharacterName(characterName);
            setCharacterId(characterId);
            setShowCharacterModal(false);
            if (setNewlyCreated) {
              setNewlyCreated(false);
            }
            if (setCharacterImg) {
              setCharacterImg(characterImg || "");
            }
          }}
          className={`whitespace-nowrap w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } focus-within:bg-primary-darker focus-within:text-text-light flex-wrap rounded-md flex px-[1rem] py-[.5rem] items-center justify-between hover:bg-primary-darker hover:text-text-light text-text-dark transition-all `}
        >
          <p className="text-[1.3rem] rounded-md">
            {characterName.length > 20
              ? characterName.substring(0, 20) + "..."
              : characterName}
          </p>
          <img
            src={characterImg || ""}
            alt="CharacterImg"
            className="w-[3rem] rounded-md"
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setCharacterName(characterName);
            setCharacterId(characterId);
            setShowCharacterModal(false);
            if (setNewlyCreated) {
              setNewlyCreated(false);
            }
            if (setCharacterImg && !characterImg) {
              setCharacterImg("");
            }
          }}
          className={`whitespace-nowrap w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-start text-[1.3rem] focus-within:bg-primary-darker focus-within:text-text-light rounded-md px-[1rem] py-[1rem] hover:bg-primary-darker hover:text-text-light text-text-dark transition-all `}
        >
          {characterName.length > 20
            ? characterName.substring(0, 20) + "..."
            : characterName}
        </button>
      )}
    </>
  );
}

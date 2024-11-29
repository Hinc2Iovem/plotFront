import { CharacterTypes, EmotionsTypes } from "../../../../../../types/StoryData/Character/CharacterTypes";
import { FinedCharacteristicTypes } from "./AllMightySearchMainContentCharacter";
import { CharacterCharacteristicsBlock } from "./CharacterCardBackSideCharacteristic";
import { CharacterEmotionBlock } from "./CharacterCardBackSideEmotion";

type CharacterCardBackSideTypes = {
  setShowBackSide: React.Dispatch<React.SetStateAction<boolean>>;
  emotions: EmotionsTypes[];
  showBackSide: boolean;
  characterType: CharacterTypes;
  characteristics: FinedCharacteristicTypes[];
  characterName: string;
  characterTag: string;
  characterUnknownName: string;
  characterDescription: string;
  characterId: string;
};

export function CharacterCardBackSide({
  setShowBackSide,
  emotions,
  characterDescription,
  characterName,
  characterTag,
  characterType,
  characteristics,
  characterUnknownName,
  characterId,
}: CharacterCardBackSideTypes) {
  const characterTypeToRus =
    characterType === "maincharacter" ? "ГГ" : characterType === "minorcharacter" ? "Второй План" : "Третий План";

  return (
    <>
      <button
        onClick={() => setShowBackSide(false)}
        className="absolute w-[2.5rem] h-[1rem] rounded-md bg-primary shadow-sm shadow-gray-700 hover:shadow-gray-600 hover:scale-[1.05] right-[.3rem] top-[.3rem]"
      ></button>

      <p
        className={`absolute text-[1.3rem] top-0 left-0 px-[1rem] rounded-br-md ${
          characterType === "maincharacter"
            ? "bg-red-500 text-text-light"
            : characterType === "minorcharacter"
            ? "bg-blue-600 text-text-light"
            : "bg-gray-600 text-text-light"
        }`}
      >
        {characterTypeToRus}
      </p>

      <div className="w-full flex flex-col gap-[.5rem] mt-[1rem] text-text-light">
        <h3 className="text-[2rem]">{characterName}</h3>
        <h4 className={`${characterType === "minorcharacter" ? "" : "hidden"} text-[1.5rem]`}>
          {`Скрытое Имя: ` + characterUnknownName}
        </h4>
        <h4 className={`${characterType === "minorcharacter" ? "" : "hidden"} text-[1.5rem]`}>
          {`Тег: ` + characterTag}
        </h4>
        <p className={`${characterType === "minorcharacter" ? "" : "hidden"} text-[1.4rem] text-gray-400`}>
          {`Описание: ` + characterDescription}
        </p>
      </div>

      <div className="flex mt-auto flex-col gap-[1rem]">
        <CharacterCharacteristicsBlock characterType={characterType} characteristics={characteristics} />
        <CharacterEmotionBlock emotions={emotions} characterId={characterId} />
      </div>
    </>
  );
}

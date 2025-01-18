import { CharacterTypes, EmotionsTypes } from "../../../../../../types/StoryData/Character/CharacterTypes";
import { FinedCharacteristicTypes } from "./AllMightySearchMainContentCharacter";
import { CharacterCharacteristicsBlock } from "./Characteristic/CharacterCardBackSideCharacteristic";
import { CharacterEmotionBlock } from "./Emotion/CharacterCardBackSideEmotion";

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
  return (
    <>
      <button
        onClick={() => setShowBackSide(false)}
        className="absolute w-[30px] h-[10px] rounded-md shadow-sm shadow-gray-700 hover:shadow-gray-600 hover:scale-[1.05] right-[.3rem] top-[.3rem]"
      ></button>

      <CharacterBadgeType characterType={characterType} />

      <CharacterInfo
        characterName={characterName}
        characterType={characterType}
        characterDescription={characterDescription}
        characterTag={characterTag}
        characterUnknownName={characterUnknownName}
      />

      <div className="flex flex-col gap-[10px] mt-[5px]">
        <CharacterCharacteristicsBlock characterType={characterType} characteristics={characteristics} />
        <CharacterEmotionBlock emotions={emotions} characterId={characterId} />
      </div>
    </>
  );
}

function CharacterBadgeType({ characterType }: { characterType: CharacterTypes }) {
  const characterTypeToRus =
    characterType === "maincharacter" ? "ГГ" : characterType === "minorcharacter" ? "Второй План" : "Третий План";

  return (
    <p
      className={`absolute text-[13px] top-0 left-0 px-[10px] rounded-br-md ${
        characterType === "maincharacter"
          ? "bg-red text-white"
          : characterType === "minorcharacter"
          ? "bg-blue-600 text-white"
          : "bg-gray-600 text-white"
      }`}
    >
      {characterTypeToRus}
    </p>
  );
}

type CharacterInfoTypes = {
  characterName: string;
  characterType: CharacterTypes;
  characterUnknownName?: string;
  characterTag?: string;
  characterDescription?: string;
};

function CharacterInfo({
  characterName,
  characterType,
  characterDescription,
  characterTag,
  characterUnknownName,
}: CharacterInfoTypes) {
  return (
    <div className="w-full flex flex-col gap-[5px] mt-[10px] text-text-light">
      <h3 className="text-[30px] text-heading">{characterName}</h3>
      <h4 className={`${characterType === "minorcharacter" ? "" : "hidden"} text-[15px] text-paragraph`}>
        {`Скрытое Имя: ` + characterUnknownName}
      </h4>
      <h4 className={`${characterType === "minorcharacter" ? "" : "hidden"} text-[15px] text-paragraph`}>
        {`Тег: ` + characterTag}
      </h4>
      <p className={`${characterType === "minorcharacter" ? "" : "hidden"} text-[14px] text-text opacity-60`}>
        {`Описание: ` + characterDescription}
      </p>
    </div>
  );
}

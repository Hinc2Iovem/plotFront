import { useState } from "react";
import EmotionHeaderCharacters from "./EmotionHeaderCharacters";
import EmotionHeaderCreateEmotion from "./EmotionHeaderCreateEmotion";
import "../../Character/characterStyle.css";

type EmotionHeaderTypes = {
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  characterId: string;
};

export default function EmotionHeader({
  setCharacterId,
  characterId,
}: EmotionHeaderTypes) {
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [characterName, setCharacterName] = useState("");

  return (
    <header className="flex flex-col gap-[1rem]">
      <div className="flex gap-[.5rem] relative w-fit items-start">
        <EmotionHeaderCharacters
          characterName={characterName}
          setCharacterName={setCharacterName}
          setCharacterId={setCharacterId}
          setShowCharacterModal={setShowCharacterModal}
          setShowModal={setShowModal}
          showCharacterModal={showCharacterModal}
        />
        {characterName.trim().length ? (
          <EmotionHeaderCreateEmotion
            characterId={characterId}
            setShowCharacterModal={setShowCharacterModal}
            setShowModal={setShowModal}
            showModal={showModal}
          />
        ) : null}
      </div>
    </header>
  );
}

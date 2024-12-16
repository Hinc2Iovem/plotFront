import { useState } from "react";
import KeyBindsByEpisodeSubHeader from "./CharacterMain/ByEpisode/KeyBindsByEpisodeSubHeader";
import KeyBindsCharacterModalByStory from "./CharacterMain/KeyBindsCharacterModalByStory";
import KeyBindsHeader from "./KeyBindsHeader/KeyBindsHeader";
import KeyBindsCharacterModalByEpisode from "./CharacterMain/KeyBindsCharacterModalByEpisode";
import PlotfieldCommandNameField from "../../../ui/Texts/PlotfieldCommandNameField";

export type KeyBindsCategoryTypes = "characters" | "commands";
export type KeyBindsCharacterSubCategoryTypes = "byStory" | "byEpisode";

export default function KeyBinds() {
  const [currentCategory, setCurrentCategory] = useState<KeyBindsCategoryTypes>("characters" as KeyBindsCategoryTypes);
  const [characterSubCategory, setCharacterSubCategory] = useState<KeyBindsCharacterSubCategoryTypes>(
    "byStory" as KeyBindsCharacterSubCategoryTypes
  );

  const [seasonId, setSeasonId] = useState("");
  const [episodeId, setEpisodeId] = useState("");
  const [seasonValue, setSeasonValue] = useState("");
  const [episodeCurrentValue, setEpisodeCurrentValue] = useState("");

  return (
    <section className="flex flex-col w-full max-w-[148rem] mx-auto gap-[.5rem] p-[1rem]">
      <KeyBindsHeader
        characterSubCategory={characterSubCategory}
        currentCategory={currentCategory}
        setCharacterSubCategory={setCharacterSubCategory}
        setCurrentCategory={setCurrentCategory}
      />
      <main className="w-full mt-[1rem]">
        <KeyBindsByEpisodeSubHeader
          episodeCurrentValue={episodeCurrentValue}
          seasonValue={seasonValue}
          setEpisodeCurrentValue={setEpisodeCurrentValue}
          setEpisodeId={setEpisodeId}
          setSeasonId={setSeasonId}
          setSeasonValue={setSeasonValue}
          seasonId={seasonId}
          characterSubCategory={characterSubCategory}
        />
        {characterSubCategory === "byStory" ? (
          <div className={`w-full flex flex-col gap-[2rem]`}>
            {...Array.from({ length: 10 }).map((_, i) => <KeyBindByStoryItem key={`keysByStory-${i}`} index={i} />)}
          </div>
        ) : (
          <div className={`w-full flex flex-col gap-[2rem] mt-[2rem]`}>
            {episodeId ? (
              Array.from({ length: 10 }).map((_, i) => (
                <KeyBindByEpisodeItem key={`keysByEpisode-${i}`} index={i} episodeId={episodeId} />
              ))
            ) : (
              <PlotfieldCommandNameField>Выберите Эпизод</PlotfieldCommandNameField>
            )}
          </div>
        )}
      </main>
    </section>
  );
}

type KeyBindByStoryItemTypes = {
  index: number;
};

const KeyBindByStoryItem = ({ index }: KeyBindByStoryItemTypes) => {
  const theme = localStorage.getItem("theme");
  const [characterId, setCharacterId] = useState("");
  const [showAllCharacters, setShowAllCharacters] = useState(false);
  const [characterName, setCharacterName] = useState("");

  return (
    <div className="flex gap-[1rem]">
      <button
        className={`${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-[2rem] text-text-light bg-primary-darker px-[1rem] py-[.5rem] rounded-md cursor-default hover:bg-secondary transition-colors focus-within:bg-secondary`}
      >
        C
      </button>
      <button
        className={`${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-[2rem] text-text-light bg-primary-darker px-[1rem] py-[.5rem] rounded-md cursor-default hover:bg-secondary transition-colors focus-within:bg-secondary`}
      >
        {index}
      </button>
      <KeyBindsCharacterModalByStory
        setShowModal={setShowAllCharacters}
        showModal={showAllCharacters}
        characterId={characterId}
        characterName={characterName}
        setCharacterId={setCharacterId}
        setCharacterName={setCharacterName}
        index={index}
      />
    </div>
  );
};

type KeyBindByEpisodeItemTypes = {
  index: number;
  episodeId: string;
};

const KeyBindByEpisodeItem = ({ index, episodeId }: KeyBindByEpisodeItemTypes) => {
  const theme = localStorage.getItem("theme");
  const [characterId, setCharacterId] = useState("");
  const [showAllCharacters, setShowAllCharacters] = useState(false);
  const [characterName, setCharacterName] = useState("");

  return (
    <div className="flex gap-[1rem]">
      <button
        className={`${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-[2rem] text-text-light bg-primary-darker px-[1rem] py-[.5rem] rounded-md cursor-default hover:bg-secondary transition-colors focus-within:bg-secondary`}
      >
        C
      </button>
      <button
        className={`${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-[2rem] text-text-light bg-primary-darker px-[1rem] py-[.5rem] rounded-md cursor-default hover:bg-secondary transition-colors focus-within:bg-secondary`}
      >
        {index}
      </button>
      <KeyBindsCharacterModalByEpisode
        setShowModal={setShowAllCharacters}
        showModal={showAllCharacters}
        characterId={characterId}
        characterName={characterName}
        setCharacterId={setCharacterId}
        setCharacterName={setCharacterName}
        index={index}
        episodeId={episodeId}
      />
    </div>
  );
};

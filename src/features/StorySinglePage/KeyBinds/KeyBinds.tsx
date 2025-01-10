import { useState } from "react";
import KeyBindsByEpisodeSubHeader from "./CharacterMain/ByEpisode/KeyBindsByEpisodeSubHeader";
import KeyBindsCharacterModal from "./CharacterMain/KeyBindsCharacterModal";
import KeyBindsHeader from "./KeyBindsHeader/KeyBindsHeader";
import { Button } from "@/components/ui/button";

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
    <section className="flex flex-col w-full max-w-[1480px] mx-auto p-[40px]">
      <KeyBindsHeader
        characterSubCategory={characterSubCategory}
        currentCategory={currentCategory}
        setCharacterSubCategory={setCharacterSubCategory}
        setCurrentCategory={setCurrentCategory}
      />
      <main className="w-full border-border border-[1px] border-t-0 rounded-b-md p-[10px]">
        <KeyBindsByEpisodeSubHeader
          episodeId={episodeId}
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
          <div className={`w-full flex flex-col gap-[20px] mt-[10px] border-border border-[1px] rounded-md p-[5px]`}>
            {...Array.from({ length: 10 }).map((_, i) => <KeyBindItem key={`keysByStory-${i}`} index={i} />)}
          </div>
        ) : (
          <div className={`w-full flex flex-col gap-[20px] mt-[10px] border-border border-[1px] rounded-md p-[5px]`}>
            {episodeId ? (
              Array.from({ length: 10 }).map((_, i) => (
                <KeyBindItem key={`keysByEpisode-${i}`} index={i} episodeId={episodeId} />
              ))
            ) : (
              <p className="text-text bg-secondary px-[10px] py-[5px] opacity-60 rounded-md hover:opacity-80 transition-all cursor-default">
                Выберите Эпизод
              </p>
            )}
          </div>
        )}
      </main>
    </section>
  );
}

type KeyBindItemTypes = {
  index: number;
  episodeId?: string;
};

const KeyBindItem = ({ index, episodeId }: KeyBindItemTypes) => {
  const [characterId, setCharacterId] = useState("");
  const [showAllCharacters, setShowAllCharacters] = useState(false);
  const [characterName, setCharacterName] = useState("");

  return (
    <div className="flex gap-[10px] items-center">
      <Button className={`text-[25px] text-text bg-secondary px-[10px] py-[20px] rounded-md cursor-default`}>C</Button>
      <Button className={`text-[25px] text-text bg-secondary px-[10px] py-[20px] rounded-md cursor-default`}>
        {index}
      </Button>
      <KeyBindsCharacterModal
        setShowModal={setShowAllCharacters}
        showModal={showAllCharacters}
        characterId={characterId}
        characterName={characterName}
        setCharacterId={setCharacterId}
        setCharacterName={setCharacterName}
        index={index}
        episodeId={episodeId}
        type="episode"
      />
    </div>
  );
};

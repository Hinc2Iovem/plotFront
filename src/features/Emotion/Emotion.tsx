import { useMemo, useState } from "react";
import useGetCharacterById from "../../hooks/Fetching/Character/useGetCharacterById";
import EmotionItem from "./EmotionItem";
import { CharacterValueTypes } from "../Editor/PlotField/PlotFieldMain/Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import GoBackButton from "@/ui/Buttons/StoryPage/GoBackButton";
import { useParams } from "react-router-dom";
import useFindoutWidthOfContainer from "@/hooks/UI/useFindoutWidthOfContainer";
import EmotionFilters from "./EmotionFilters";
import { EmotionValueTypes } from "../Editor/PlotField/PlotFieldMain/Commands/Prompts/Emotions/PlotfieldEmotionPromptMain";
import NewEmotionForm from "./Form/NewEmotionForm";

export default function Emotion() {
  const { storyId } = useParams();
  const [created, setCreated] = useState<boolean | null>(null);
  const [emotionSearch, setEmotionSearch] = useState("");
  const defaultObj = {
    emotionId: "",
    emotionImg: "",
    emotionName: "",
  };
  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>({
    _id: "",
    characterName: "",
    imgUrl: "",
  });

  const [emotionValue, setEmotionValue] = useState<EmotionValueTypes>(defaultObj);
  const [initEmotionValue, setInitEmotionValue] = useState<EmotionValueTypes>(defaultObj);

  const { data: currentCharacter } = useGetCharacterById({ characterId: characterValue._id || "" });

  const filteredEmotions = useMemo(() => {
    if (currentCharacter) {
      if (emotionSearch.trim().length) {
        return currentCharacter.emotions.filter((e) =>
          e.emotionName.trim().toLowerCase().includes(emotionSearch.trim().toLowerCase())
        );
      } else {
        return currentCharacter.emotions;
      }
    } else {
      return [];
    }
  }, [currentCharacter, emotionSearch]);

  const { ref, width } = useFindoutWidthOfContainer();

  return (
    <>
      <GoBackButton className="text-[25px]" link={`/stories/${storyId}`} />
      <section className="max-w-[1480px] mx-auto relative">
        <main className="my-[10px] flex md:flex-row flex-col-reverse gap-[5px] px-[5px]">
          <div
            ref={ref}
            className="w-full flex-grow h-screen border-border border-[1px] rounded-md relative overflow-y-auto | containerScroll"
          >
            <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-[5px] justify-items-center p-[5px] rounded-md">
              {filteredEmotions &&
                filteredEmotions?.map((cd) => (
                  <EmotionItem
                    key={cd._id}
                    characterId={characterValue._id || ""}
                    created={created}
                    setInitEmotionValue={setInitEmotionValue}
                    setEmotionValue={setEmotionValue}
                    emotionValue={emotionValue}
                    {...cd}
                  />
                ))}
            </div>
            <div className="h-[50px] w-full"></div>
          </div>
          <EmotionFilters
            width={width}
            characterValue={characterValue}
            setCharacterValue={setCharacterValue}
            emotionSearch={emotionSearch}
            setEmotionSearch={setEmotionSearch}
          />
          <NewEmotionForm
            setInitEmotionValue={setInitEmotionValue}
            emotionValue={emotionValue}
            characterId={characterValue._id || ""}
            initEmotionValue={initEmotionValue}
            setEmotionValue={setEmotionValue}
            setCreated={setCreated}
          />
        </main>
      </section>
    </>
  );
}

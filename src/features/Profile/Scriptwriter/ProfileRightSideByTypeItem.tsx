import { useEffect, useState } from "react";
import { EpisodeStatusTypes } from "../../../types/StoryData/Episode/EpisodeTypes";
import { StoryFilterTypes } from "../../Story/Story";
import ProfileRightSideItem from "./ProfileRightSideItem";
import useGetTranslationStory from "../../../hooks/Fetching/Translation/useGetTranslationStory";

type ProfileRightSideByTypeItemTypes = {
  storiesType: StoryFilterTypes;
  storyStatus?: EpisodeStatusTypes;
  storyId: string;
  setOpenedStoryId: React.Dispatch<React.SetStateAction<string>>;
  openedStoryId: string;
  setCharacterIds: React.Dispatch<React.SetStateAction<string[]>>;
  characterIds: string[];
  assignedWorkers?:
    | {
        staffId: string;
        storyStatus: EpisodeStatusTypes;
      }[]
    | undefined;
  imgUrl?: string;
};
export default function ProfileRightSideByTypeItem({
  characterIds,
  openedStoryId,
  setCharacterIds,
  setOpenedStoryId,
  storiesType,
  storyId,
  assignedWorkers,
  storyStatus,
  imgUrl,
}: ProfileRightSideByTypeItemTypes) {
  const { data: translationStory } = useGetTranslationStory({
    id: storyId,
    language: "russian",
  });

  const [title, setTitle] = useState("");
  const [showScriptwriters, setShowScriptwriters] = useState(false);

  useEffect(() => {
    if (translationStory) {
      translationStory.map((d) => {
        if (d.translations[0]?.textFieldName === "storyName") {
          setTitle(d.translations[0]?.text);
        }
      });
    }
  }, [translationStory]);

  return (
    <ProfileRightSideItem
      characterIds={characterIds}
      imgUrl={imgUrl || ""}
      setShowScriptwriters={setShowScriptwriters}
      showScriptwriters={showScriptwriters}
      openedStoryId={openedStoryId}
      setCharacterIds={setCharacterIds}
      setOpenedStoryId={setOpenedStoryId}
      storiesType={storiesType}
      storyId={storyId}
      title={title}
      assignedWorkers={assignedWorkers}
      storyStatus={storyStatus}
    />
  );
}

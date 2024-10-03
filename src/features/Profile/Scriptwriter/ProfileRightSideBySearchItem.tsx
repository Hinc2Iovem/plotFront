import { useEffect, useState } from "react";
import useGetSingleStory from "../../../hooks/Fetching/Story/useGetSingleStory";
import { StoryFilterTypes } from "../../Story/Story";
import ProfileRightSideItem from "./ProfileRightSideItem";
import { TranslationStoryTypes } from "../../../types/Additional/TranslationTypes";

type ProfileRightSideBySearchItemTypes = {
  storiesType: StoryFilterTypes;
  storyId: string;
  setOpenedStoryId: React.Dispatch<React.SetStateAction<string>>;
  openedStoryId: string;
  setCharacterIds: React.Dispatch<React.SetStateAction<string[]>>;
  characterIds: string[];
} & TranslationStoryTypes;

export default function ProfileRightSideBySearchItem({
  characterIds,
  openedStoryId,
  setCharacterIds,
  setOpenedStoryId,
  storiesType,
  storyId,
  translations,
}: ProfileRightSideBySearchItemTypes) {
  const { data: story } = useGetSingleStory({ storyId });
  const [showScriptwriters, setShowScriptwriters] = useState(false);
  const [storyTitle] = useState(
    translations.find((t) => t.textFieldName === "storyName")?.text || ""
  );
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    if (story) {
      setImgUrl(story?.imgUrl || "");
    }
  }, [story]);
  return (
    <ProfileRightSideItem
      characterIds={characterIds}
      imgUrl={imgUrl}
      openedStoryId={openedStoryId}
      setCharacterIds={setCharacterIds}
      setOpenedStoryId={setOpenedStoryId}
      storiesType={storiesType}
      storyId={storyId}
      title={storyTitle}
      assignedWorkers={story?.storyStaffInfo || []}
      storyStatus={story?.storyStatus}
      showScriptwriters={showScriptwriters}
      setShowScriptwriters={setShowScriptwriters}
    />
  );
}

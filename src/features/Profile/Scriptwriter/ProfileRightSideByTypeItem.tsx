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
export default function ProfileRightSideByTypeItem({ storyId, storyStatus, imgUrl }: ProfileRightSideByTypeItemTypes) {
  const { data: translationStory } = useGetTranslationStory({
    id: storyId,
    language: "russian",
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (translationStory) {
      translationStory.map((d) => {
        if (d.translations[0]?.textFieldName === "storyName") {
          setTitle(d.translations[0]?.text);
        } else if (d.translations[0]?.textFieldName === "storyDescription") {
          setDescription(d.translations[0]?.text);
        }
      });
    }
  }, [translationStory]);

  return (
    <ProfileRightSideItem
      imgUrl={imgUrl || ""}
      storyId={storyId}
      title={title}
      storyStatus={storyStatus}
      description={description}
    />
  );
}

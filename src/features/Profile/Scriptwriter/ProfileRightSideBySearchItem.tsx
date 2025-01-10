import { useEffect, useState } from "react";
import useGetSingleStory from "../../../hooks/Fetching/Story/useGetSingleStory";
import { TranslationStoryTypes } from "../../../types/Additional/TranslationTypes";
import ProfileRightSideItem from "./ProfileRightSideItem";

type ProfileRightSideBySearchItemTypes = {
  storyId: string;
} & TranslationStoryTypes;

export default function ProfileRightSideBySearchItem({ storyId, translations }: ProfileRightSideBySearchItemTypes) {
  const { data: story } = useGetSingleStory({ storyId });
  const [storyTitle] = useState(translations.find((t) => t.textFieldName === "storyName")?.text || "");
  const [storyDescription] = useState(translations.find((t) => t.textFieldName === "storyDescription")?.text || "");
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    if (story) {
      setImgUrl(story?.imgUrl || "");
    }
  }, [story]);

  return (
    <ProfileRightSideItem
      imgUrl={imgUrl}
      description={storyDescription}
      storyId={storyId}
      title={storyTitle}
      storyStatus={story?.storyStatus}
    />
  );
}

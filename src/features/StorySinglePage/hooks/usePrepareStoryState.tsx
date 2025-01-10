import useGetSingleStory from "@/hooks/Fetching/Story/useGetSingleStory";
import useGetTranslationStoryById from "@/hooks/Fetching/Story/useGetTranslationStoryById";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function usePrepareStoryState() {
  const { storyId } = useParams();
  const { data: translatedStory } = useGetTranslationStoryById({
    language: "russian",
    storyId: storyId || "",
  });

  const { data: story } = useGetSingleStory({ storyId: storyId || "" });

  const [storyInfo, setStoryInfo] = useState({
    storyName: "",
    storyDescription: "",
    storyGenre: "",
    storyImg: "",
  });

  useEffect(() => {
    if (translatedStory) {
      translatedStory.translations.map((ts) => {
        if (ts.textFieldName === "storyName") {
          setStoryInfo((prev) => ({
            ...prev,
            storyName: ts?.text || "",
          }));
        } else if (ts.textFieldName === "storyDescription") {
          setStoryInfo((prev) => ({
            ...prev,
            storyDescription: ts?.text || "",
          }));
        } else if (ts.textFieldName === "storyGenre") {
          setStoryInfo((prev) => ({
            ...prev,
            storyGenre: ts?.text || "",
          }));
        }
      });
    }
  }, [translatedStory]);

  useEffect(() => {
    if (story) {
      setStoryInfo((prev) => ({
        ...prev,
        storyImg: story?.imgUrl || "",
      }));
    }
  }, [story]);

  return { storyInfo, setStoryInfo };
}

import { useParams } from "react-router-dom";
import useGetAllTranslationAchievementByStoryId from "../../../PlotField/hooks/Achievement/useGetAllTranslationAchievementByStoryId";

type AllMightySearchMainContentAchievementTypes = {
  debouncedValue: string;
};

export default function AllMightySearchMainContentAchievement({
  debouncedValue,
}: AllMightySearchMainContentAchievementTypes) {
  const { storyId } = useParams();

  const { data: achievementsTranslated } = useGetAllTranslationAchievementByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  console.log(achievementsTranslated, debouncedValue);

  return <div></div>;
}

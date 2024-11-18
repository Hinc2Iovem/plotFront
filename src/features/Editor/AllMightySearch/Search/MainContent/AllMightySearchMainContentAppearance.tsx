import { useParams } from "react-router-dom";
import useGetTranslationAppearancePartsByStoryId from "../../../../../hooks/Fetching/Translation/AppearancePart/useGetTranslationAppearancePartsByStoryId";

type AllMightySearchMainContentAppearanceTypes = {
  debouncedValue: string;
};

export default function AllMightySearchMainContentAppearance({
  debouncedValue,
}: AllMightySearchMainContentAppearanceTypes) {
  const { storyId } = useParams();

  const { data: appearanceTranslatedWithoutCharacter } = useGetTranslationAppearancePartsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  console.log(appearanceTranslatedWithoutCharacter, debouncedValue);

  return <div></div>;
}

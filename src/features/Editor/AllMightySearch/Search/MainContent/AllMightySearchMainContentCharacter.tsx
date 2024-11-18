import { useParams } from "react-router-dom";
import useGetTranslationCharactersByType from "../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharactersByType";

type AllMightySearchMainContentCharacterTypes = {
  debouncedValue: string;
};

export default function AllMightySearchMainContentCharacter({
  debouncedValue,
}: AllMightySearchMainContentCharacterTypes) {
  const { storyId } = useParams();

  const { data: translatedCharacter } = useGetTranslationCharactersByType({
    language: "russian",
    storyId: storyId || "",
    debouncedValue: debouncedValue?.trim().length ? debouncedValue : "",
    characterType: "all",
  });
  console.log(translatedCharacter, debouncedValue);

  return <div></div>;
}

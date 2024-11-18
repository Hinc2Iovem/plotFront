import { useParams } from "react-router-dom";
import useGetAllCharacteristicsByStoryId from "../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";

type AllMightySearchMainContentCharacteristicTypes = {
  debouncedValue: string;
};

export default function AllMightySearchMainContentCharacteristic({
  debouncedValue,
}: AllMightySearchMainContentCharacteristicTypes) {
  const { storyId } = useParams();

  const { data: translatedCharacteristic } = useGetAllCharacteristicsByStoryId({
    language: "russian",
    storyId: storyId || "",
  });

  console.log(translatedCharacteristic, debouncedValue);

  return <div></div>;
}

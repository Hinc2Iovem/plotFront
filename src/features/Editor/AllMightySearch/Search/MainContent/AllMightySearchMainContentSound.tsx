import { useParams } from "react-router-dom";
import useGetAllSoundByStoryId from "../../../PlotField/hooks/Sound/useGetAllSoundsByStoryId";

type AllMightySearchMainContentSoundTypes = {
  debouncedValue: string;
};

export default function AllMightySearchMainContentSound({ debouncedValue }: AllMightySearchMainContentSoundTypes) {
  const { storyId } = useParams();

  const { data: allSound } = useGetAllSoundByStoryId({ storyId: storyId || "" });
  console.log(allSound, debouncedValue);

  return <div></div>;
}

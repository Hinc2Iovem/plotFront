import { useParams } from "react-router-dom";
import useGetAllMusicByStoryId from "../../../PlotField/hooks/Music/useGetAllMusicByStoryId";

type AllMightySearchMainContentMusicTypes = {
  debouncedValue: string;
};

export default function AllMightySearchMainContentMusic({ debouncedValue }: AllMightySearchMainContentMusicTypes) {
  const { storyId } = useParams();

  const { data: allMusic } = useGetAllMusicByStoryId({ storyId: storyId || "" });

  console.log(allMusic, debouncedValue);

  return <div></div>;
}

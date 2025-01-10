import useGetDecodedJWTValues from "../../../hooks/Auth/useGetDecodedJWTValues";
import useGetAllAssignedStoryTranslationsSearch from "../../../hooks/Fetching/Story/useGetAllAssignedStoryTranslationsSearch";
import useGetAllStoryTranslationsSearch from "../../../hooks/Fetching/Story/useGetAllStoryTranslationsSearch";
import { StoryFilterTypes } from "../../Story/Story";
import ProfileRightSideBySearchItem from "./ProfileRightSideBySearchItem";

type ProfileRightSideTypes = {
  storiesType: StoryFilterTypes;
  debouncedStory: string;
};

export default function ProfileRightSideScriptWriter({ storiesType, debouncedStory }: ProfileRightSideTypes) {
  const { userId: staffId } = useGetDecodedJWTValues();

  const { data: allTranslatedStories } = useGetAllStoryTranslationsSearch({
    language: "russian",
    storiesType,
    debouncedValue: debouncedStory,
  });

  const { data: allAssignedTranslatedStories } = useGetAllAssignedStoryTranslationsSearch({
    language: "russian",
    storyStatus: storiesType !== "all" && storiesType !== "allAssigned" ? storiesType : "",
    debouncedValue: debouncedStory,
    staffId: staffId || "",
    startFetching: storiesType === "all" ? false : true,
  });

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] border-border border-[1px] gap-[10px] p-[10px] rounded-md justify-items-center justify-center w-full">
      {storiesType === "all" && allTranslatedStories?.length
        ? allTranslatedStories.map((ts) => <ProfileRightSideBySearchItem key={ts._id} {...ts} />)
        : allAssignedTranslatedStories?.length
        ? allAssignedTranslatedStories.map((ts) => <ProfileRightSideBySearchItem key={ts._id} {...ts} />)
        : null}
    </div>
  );
}

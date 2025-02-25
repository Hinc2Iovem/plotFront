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
  const { userId: staffId, roles } = useGetDecodedJWTValues();

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
    startFetching: roles?.includes("scriptwriter") ? true : false,
  });

  console.log(roles?.includes("scriptwriter"), allAssignedTranslatedStories);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] grid-rows-[repeat(auto-fill,minmax(207.5px,1fr))] border-border border-[1px] gap-[10px] p-[10px] rounded-md justify-items-center justify-center w-full h-[calc(100vh-20px)] overflow-y-auto | containerScroll">
      {/* for headscriptwriter show all stories
       for scriptwriter only his assigned stories
   */}
      {roles?.includes("headscriptwriter") && storiesType === "all" && allTranslatedStories?.length
        ? allTranslatedStories.map((ts) => <ProfileRightSideBySearchItem key={ts._id} {...ts} />)
        : roles?.includes("scriptwriter") && allAssignedTranslatedStories
        ? allAssignedTranslatedStories.map((ts) => <ProfileRightSideBySearchItem key={ts._id} {...ts} />)
        : null}
    </div>
  );
}

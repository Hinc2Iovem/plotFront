import { useEffect, useState } from "react";
import useGetDecodedJWTValues from "../../../hooks/Auth/useGetDecodedJWTValues";
import useGetAllAssignedStoryTranslationsSearch from "../../../hooks/Fetching/Story/useGetAllAssignedStoryTranslationsSearch";
import useGetAllStoryTranslationsSearch from "../../../hooks/Fetching/Story/useGetAllStoryTranslationsSearch";
import { StoryFilterTypes } from "../../Story/Story";
import ProfileRightSideBySearchItem from "./ProfileRightSideBySearchItem";

type ProfileRightSideTypes = {
  storiesType: StoryFilterTypes;
  debouncedStory: string;
};

export default function ProfileRightSideScriptWriter({
  storiesType,
  debouncedStory,
}: ProfileRightSideTypes) {
  const [openedStoryId, setOpenedStoryId] = useState("");
  const [characterIds, setCharacterIds] = useState<string[]>([]);
  const { userId: staffId } = useGetDecodedJWTValues();

  useEffect(() => {
    setOpenedStoryId("");
  }, [storiesType]);

  const { data: allTranslatedStories } = useGetAllStoryTranslationsSearch({
    language: "russian",
    storiesType,
    debouncedValue: debouncedStory,
  });

  const { data: allAssignedTranslatedStories } =
    useGetAllAssignedStoryTranslationsSearch({
      language: "russian",
      storyStatus:
        storiesType !== "all" && storiesType !== "allAssigned"
          ? storiesType
          : "",
      debouncedValue: debouncedStory,
      staffId: staffId || "",
      startFetching: storiesType === "all" ? false : true,
    });

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-[1rem] justify-items-center justify-center w-full">
      {
        storiesType === "all" && allTranslatedStories?.length
          ? allTranslatedStories.map((ts) => (
              <ProfileRightSideBySearchItem
                key={ts._id}
                setOpenedStoryId={setOpenedStoryId}
                openedStoryId={openedStoryId}
                storiesType={storiesType}
                characterIds={characterIds}
                setCharacterIds={setCharacterIds}
                {...ts}
              />
            ))
          : allAssignedTranslatedStories?.length
          ? allAssignedTranslatedStories.map((ts) => (
              <ProfileRightSideBySearchItem
                key={ts._id}
                setOpenedStoryId={setOpenedStoryId}
                openedStoryId={openedStoryId}
                storiesType={storiesType}
                characterIds={characterIds}
                setCharacterIds={setCharacterIds}
                {...ts}
              />
            ))
          : null
        // : assignedStories?.map((st) => (
        //     <ProfileRightSideBySearchItem
        //       key={st._id}
        //       setOpenedStoryId={setOpenedStoryId}
        //       openedStoryId={openedStoryId}
        //       storiesType={storiesType}
        //       storyId={st.storyId}
        //       characterIds={characterIds}
        //       setCharacterIds={setCharacterIds}
        //       title={st.textFieldName === "storyName" ? st.text : ""}
        //     />))
      }
    </div>
  );
}

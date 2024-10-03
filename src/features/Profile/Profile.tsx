import { useState } from "react";
import useGetDecodedJWTValues from "../../hooks/Auth/useGetDecodedJWTValues";
import useCheckKeysCombinationExpandTranslationSide from "../../hooks/helpers/useCheckKeysCombinationExpandTranslationSide";
import useDebounce from "../../hooks/utilities/useDebounce";
import { StoryFilterTypes } from "../Story/Story";
import ProfileLeftSide from "./ProfileLeftSide";
import ProfileRightSideScriptWriter from "./Scriptwriter/ProfileRightSideScriptWriter";
import ProfileRightSideTranslator from "./Translator/ProfileRightSideTranslator";

export default function Profile() {
  const { roles } = useGetDecodedJWTValues();
  const expandedTranslationSide =
    useCheckKeysCombinationExpandTranslationSide();

  const [storiesType, setStoriesType] = useState<StoryFilterTypes>(
    "" as StoryFilterTypes
  );
  const [searchValue, setSearchValue] = useState("");
  const debouncedStory = useDebounce({ value: searchValue, delay: 600 });

  return (
    <section className="max-w-[146rem] px-[1rem] mx-auto flex sm:flex-row flex-col gap-[1rem] py-[1rem] relative items-center sm:items-start">
      <ProfileLeftSide
        expandedTranslationSide={
          expandedTranslationSide === "expandTranslationSide"
        }
        setSearchValue={setSearchValue}
        setStoriesType={setStoriesType}
        storiesType={storiesType}
      />
      {roles?.includes("translator" || "editor") ? (
        <ProfileRightSideTranslator />
      ) : roles?.includes("headscriptwriter" || "editor" || "scriptwriter") &&
        storiesType ? (
        <div className="w-full flex flex-col gap-[1rem]">
          <ProfileRightSideScriptWriter
            storiesType={storiesType}
            debouncedStory={debouncedStory || ""}
          />
        </div>
      ) : null}
    </section>
  );
}

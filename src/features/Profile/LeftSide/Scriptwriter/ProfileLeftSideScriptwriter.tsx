import { useState } from "react";
import useGetDecodedJWTValues from "../../../../hooks/Auth/useGetDecodedJWTValues";
import { StoryFilterTypes } from "../../../Story/Story";
import StoryFilterTypesHeader from "../../../Story/StoryFilterTypes";
import CreateStory from "./CreateStory";
import { useQueryClient } from "@tanstack/react-query";
import { getAllTranslationStoriesSearch } from "../../../../hooks/Fetching/Story/useGetAllStoryTranslationsSearch";

type ProfileLeftSideScriptwriterTypes = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setStoriesType: React.Dispatch<React.SetStateAction<StoryFilterTypes>>;
  storiesType: StoryFilterTypes;
};

export default function ProfileLeftSideScriptwriter({
  setSearchValue,
  storiesType,
  setStoriesType,
}: ProfileLeftSideScriptwriterTypes) {
  const queryClient = useQueryClient();
  const { roles } = useGetDecodedJWTValues();
  const [localSearchValue, setLocalSearchValue] = useState("");
  const [localAssignedSearchValue, setLocalAssignedSearchValue] = useState("");

  const prefetchAllStories = () => {
    queryClient.prefetchQuery({
      queryKey: ["translation", "stories", "search", ""],
      queryFn: () =>
        getAllTranslationStoriesSearch({
          debouncedValue: "",
          language: "russian",
        }),
    });
  };
  return (
    <div
      className={`${
        (roles || []).includes("scriptwriter" || "headscriptwriter" || "editor")
          ? ""
          : "hidden"
      } flex gap-[1rem] flex-col flex-grow min-w-[20rem] sm:bg-none bg-neutral-alabaster p-[1rem] justify-center shadow-sm`}
    >
      <div className="bg-neutral-alabaster w-full flex-grow flex flex-col gap-[1rem] py-[1rem] p-[.5rem] rounded-md shadow-md">
        <h2 className="text-[1.6rem] w-full sm:pl-[0rem] pl-[1.5rem] sm:text-center text-gray-700 font-medium">
          Все Истории
        </h2>
        <form
          className="w-full bg-white rounded-md shadow-sm"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            name="StorySearch"
            id="storySearch"
            className="w-full text-[1.5rem] text-gray-700 px-[1rem] py-[.5rem] outline-none  rounded-md"
            placeholder="Название Истории"
            value={localSearchValue}
            onChange={(e) => {
              setLocalSearchValue(e.target.value);
              setSearchValue(e.target.value);
              if (storiesType !== "all") {
                setLocalAssignedSearchValue("");
                setStoriesType("all");
              }
            }}
          />
        </form>
        <ul className="flex flex-col gap-[1rem] bg-white rounded-md p-[1rem] shadow-sm">
          <li>
            <button
              onMouseEnter={prefetchAllStories}
              onFocus={prefetchAllStories}
              onClick={() => {
                setStoriesType("all");
                setLocalAssignedSearchValue("");
              }}
              className={`text-[1.4rem] ${
                storiesType === "all"
                  ? "rounded-md bg-primary-light-blue text-white w-full text-start px-[1rem] py-[.5rem]"
                  : ""
              } w-full hover:bg-primary-light-blue outline-gray-300 hover:text-white hover:w-full hover:px-[1rem] hover:py-[.5rem] hover:rounded-md text-start transition-all `}
            >
              Все
            </button>
          </li>
        </ul>
      </div>
      <div
        className={`bg-neutral-alabaster w-full flex-grow flex flex-col gap-[1rem] py-[1rem] p-[.5rem] rounded-md shadow-md`}
      >
        <h2 className="text-[1.6rem] w-full sm:pl-[0rem] pl-[1.5rem] sm:text-center text-gray-700 font-medium">
          Назначенные Истории
        </h2>
        <form
          className="w-full bg-white rounded-md shadow-sm"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            name="StorySearch"
            id="storySearch"
            className="w-full text-[1.5rem] text-gray-700 px-[1rem] py-[.5rem] outline-none  rounded-md"
            placeholder="Название Истории"
            value={localAssignedSearchValue}
            onChange={(e) => {
              setLocalAssignedSearchValue(e.target.value);
              setSearchValue(e.target.value);
              if (storiesType !== "allAssigned") {
                if (storiesType === "all") {
                  setStoriesType("allAssigned");
                }
                setLocalSearchValue("");
              }
            }}
          />
        </form>
        <StoryFilterTypesHeader
          setLocalSearchValue={setLocalSearchValue}
          setStoriesType={setStoriesType}
          storiesType={storiesType}
        />
      </div>
      <CreateStory />
    </div>
  );
}

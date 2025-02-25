import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllAssignedStories } from "@/hooks/Fetching/Story/useGetAllAssignedStoryTranslationsSearch";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useGetDecodedJWTValues from "../../../../hooks/Auth/useGetDecodedJWTValues";
import { getAllTranslationStoriesSearch } from "../../../../hooks/Fetching/Story/useGetAllStoryTranslationsSearch";
import { StoryFilterTypes } from "../../../Story/Story";
import CreateStory from "./CreateStory";

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
  const { userId, roles } = useGetDecodedJWTValues();
  const prefetchAllAssignedStories = (storyStatus: string) => {
    queryClient.prefetchQuery({
      queryKey: ["translation", "assigned", "stories", storyStatus, userId, "search", ""],
      queryFn: () =>
        getAllAssignedStories({
          debouncedValue: "",
          language: "russian",
          staffId: userId || "",
          storyStatus,
        }),
    });
  };
  const [localSearchValue, setLocalSearchValue] = useState("");
  const [, setLocalAssignedSearchValue] = useState("");

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
        roles?.includes("headscriptwriter") || roles?.includes("editor") ? "" : "hidden"
      } flex gap-[10px] flex-col flex-grow min-w-[200px] p-[10px] justify-center border-[1px] border-border rounded-md`}
    >
      <div className={`w-full flex-grow flex flex-col gap-[10px] py-[10px] p-[5px] rounded-md shadow-md`}>
        <form className="w-full bg-secondary rounded-md shadow-sm" onSubmit={(e) => e.preventDefault()}>
          <Input
            type="text"
            name="StorySearch"
            id="storySearch"
            className="w-full text-[15px] text-text px-[10px] py-[5px] outline-none rounded-md"
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

        <ul className={`flex flex-col gap-[5px] rounded-md`}>
          <li>
            <Button
              onMouseEnter={prefetchAllStories}
              onFocus={prefetchAllStories}
              onClick={() => {
                setStoriesType("all");
                setLocalAssignedSearchValue("");
              }}
              className={` ${
                storiesType === "all"
                  ? "rounded-md bg-secondary text-text w-full"
                  : "bg-accent focus-within:text-text hover:text-text opacity-80 hover:opacity-100 focus-within:opacity-100 focus-within:bg-secondary hover:bg-secondary"
              } w-full outline-gray-300 text-text transition-all px-[10px] py-[20px] text-[15px]`}
            >
              Все
            </Button>
          </li>
          <li>
            <Button
              onFocus={() => prefetchAllAssignedStories("done")}
              onMouseEnter={() => prefetchAllAssignedStories("done")}
              onClick={() => {
                if (setLocalSearchValue) {
                  setLocalSearchValue("");
                }
                setStoriesType("done");
              }}
              className={` ${
                storiesType === "done"
                  ? "rounded-md bg-secondary text-text w-full text-start px-[10px] py-[5px]"
                  : "hover:bg-secondary hover:text-text bg-accent text-text opacity-80 hover:opacity-100 focus-within:opacity-100"
              } w-full outline-gray-300 transition-all py-[20px] text-[15px] `}
            >
              Законченные
            </Button>
          </li>
          <li>
            <Button
              onFocus={() => prefetchAllAssignedStories("doing")}
              onMouseEnter={() => prefetchAllAssignedStories("doing")}
              onClick={() => {
                if (setLocalSearchValue) {
                  setLocalSearchValue("");
                }
                setStoriesType("doing");
              }}
              className={` ${
                storiesType === "doing"
                  ? "rounded-md bg-secondary text-text w-full text-start px-[10px] py-[5px]"
                  : "hover:bg-secondary hover:text-text bg-accent text-text opacity-80 hover:opacity-100 focus-within:opacity-100"
              } w-full outline-gray-300 transition-all py-[20px] text-[15px] `}
            >
              В Процессе
            </Button>
          </li>
        </ul>
      </div>

      <CreateStory />
    </div>
  );
}

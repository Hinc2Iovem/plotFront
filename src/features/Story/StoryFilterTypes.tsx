import { useQueryClient } from "@tanstack/react-query";
import { StoryFilterTypes } from "./Story";
import { getAllAssignedStories } from "../../hooks/Fetching/Story/useGetAllAssignedStoryTranslationsSearch";
import useGetDecodedJWTValues from "../../hooks/Auth/useGetDecodedJWTValues";
import { Button } from "@/components/ui/button";

type StoryFilterTypesProps = {
  setStoriesType: React.Dispatch<React.SetStateAction<StoryFilterTypes>>;
  setLocalSearchValue?: React.Dispatch<React.SetStateAction<string>>;
  storiesType: StoryFilterTypes;
};

export default function StoryFilterTypesHeader({
  storiesType,
  setStoriesType,
  setLocalSearchValue,
}: StoryFilterTypesProps) {
  const queryClient = useQueryClient();
  const { userId } = useGetDecodedJWTValues();
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
  return (
    <ul className="flex flex-col gap-[5px] rounded-md">
      <li>
        <Button
          onMouseEnter={() => prefetchAllAssignedStories("")}
          onFocus={() => prefetchAllAssignedStories("")}
          onClick={() => {
            if (setLocalSearchValue) {
              setLocalSearchValue("");
            }
            setStoriesType("allAssigned");
          }}
          className={`text-[1.4rem] ${
            storiesType === "allAssigned"
              ? "rounded-md bg-secondary text-text w-full text-start px-[10px] py-[5px]"
              : "hover:bg-secondary hover:text-text bg-accent text-text opacity-80 hover:opacity-100 focus-within:opacity-100"
          } w-full outline-gray-300 transition-all py-[20px] text-[15px]`}
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
          className={`text-[1.4rem] ${
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
          className={`text-[1.4rem] ${
            storiesType === "doing"
              ? "rounded-md bg-secondary text-text w-full text-start px-[10px] py-[5px]"
              : "hover:bg-secondary hover:text-text bg-accent text-text opacity-80 hover:opacity-100 focus-within:opacity-100"
          } w-full outline-gray-300 transition-all py-[20px] text-[15px] `}
        >
          В Процессе
        </Button>
      </li>
    </ul>
  );
}

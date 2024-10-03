import { useQueryClient } from "@tanstack/react-query";
import { StoryFilterTypes } from "./Story";
import { getAllAssignedStories } from "../../hooks/Fetching/Story/useGetAllAssignedStoryTranslationsSearch";
import useGetDecodedJWTValues from "../../hooks/Auth/useGetDecodedJWTValues";

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
      queryKey: [
        "translation",
        "assigned",
        "stories",
        storyStatus,
        userId,
        "search",
        "",
      ],
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
    <ul className="flex flex-col gap-[1rem] bg-white rounded-md p-[1rem] shadow-sm">
      <li>
        <button
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
              ? "rounded-md bg-primary-light-blue text-white w-full text-start px-[1rem] py-[.5rem]"
              : ""
          } w-full hover:bg-primary-light-blue outline-gray-300 hover:text-white hover:w-full hover:px-[1rem] hover:py-[.5rem] hover:rounded-md text-start transition-all `}
        >
          Все
        </button>
      </li>
      <li>
        <button
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
              ? "rounded-md bg-primary-light-blue text-white w-full text-start px-[1rem] py-[.5rem]"
              : ""
          } w-full hover:bg-primary-light-blue outline-gray-300 hover:text-white hover:w-full hover:px-[1rem] hover:py-[.5rem] hover:rounded-md text-start transition-all `}
        >
          Законченные
        </button>
      </li>
      <li>
        <button
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
              ? "rounded-md bg-primary-light-blue text-white w-full text-start px-[1rem] py-[.5rem]"
              : ""
          } w-full hover:bg-primary-light-blue outline-gray-300 hover:text-white hover:w-full hover:px-[1rem] hover:py-[.5rem] hover:rounded-md text-start transition-all `}
        >
          В Процессе
        </button>
      </li>
    </ul>
  );
}

import { useState } from "react";
import useGetStoryTranslationByTextFieldNameAndSearch from "../../hooks/Fetching/Story/useGetStoryTranslationByTextFieldNameAndSearch";
import useDebounce from "../../hooks/utilities/useDebounce";
import PaginatedSkeleton from "./Skeleton/PaginatedSkeleton";
import StoryDebounced from "./StoryDebounced/StoryDebounced";
import StoryFilterTypesHeader from "./StoryFilterTypes";
import StoryHeader from "./StoryHeader";
import StoryList from "./StoryList";

export type StoryFilterTypes = "all" | "allAssigned" | "done" | "doing";

export default function Story() {
  const [storiesType, setStoriesType] =
    useState<StoryFilterTypes>("allAssigned");
  const [searchValue, setSearchValue] = useState("");

  const debouncedValue = useDebounce({ value: searchValue, delay: 500 });

  const {
    data: translations,
    isLoading,
    isError,
    error,
  } = useGetStoryTranslationByTextFieldNameAndSearch({
    debouncedValue,
    language: "russian",
    storiesType,
  });

  if (isLoading) {
    return (
      <section className="max-w-[146rem] px-[1rem] mx-auto flex flex-col gap-[3rem] mb-[2rem]">
        <StoryHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <StoryFilterTypesHeader
          setStoriesType={setStoriesType}
          storiesType={storiesType}
        />
        <PaginatedSkeleton />;
      </section>
    );
  } else if (isError) {
    console.error(error.message);
    return (
      <h2 className="text-center text-[3.5rem] text-gray-700">
        Something went wrong
      </h2>
    );
  }

  return (
    <section className="max-w-[146rem] px-[1rem] mx-auto flex flex-col gap-[3rem] mb-[2rem]">
      <StoryHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      {!debouncedValue.trim().length ? (
        <>
          <StoryFilterTypesHeader
            setStoriesType={setStoriesType}
            storiesType={storiesType}
          />

          <StoryList storiesType={storiesType} />
        </>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(25rem,1fr))] gap-[1rem] justify-items-center justify-center w-full">
          {translations?.map((t) => (
            <StoryDebounced key={t._id} {...t} />
          ))}
        </div>
      )}
    </section>
  );
}

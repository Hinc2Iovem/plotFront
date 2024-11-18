import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import PlotfieldButton from "../../../../shared/Buttons/PlotfieldButton";
import useGetAllKeysByStoryId from "../../../PlotField/hooks/Key/useGetAllKeysByStoryId";
import useGetPaginatedKey, { AllMightySearchKeyResultTypes } from "../../hooks/useGetPaginatedKey";
import { KeyTypes } from "../../../../../types/StoryEditor/PlotField/Key/KeyTypes";
import { NewElementTypes } from "./AllMightySearchMainContent";

type AllMightySearchMainContentKeyTypes = {
  debouncedValue: string;
  newElement: NewElementTypes;
};

export default function AllMightySearchMainContentKey({
  debouncedValue,
  newElement,
}: AllMightySearchMainContentKeyTypes) {
  const { storyId } = useParams();
  const { ref, inView } = useInView();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: keys } = useGetAllKeysByStoryId({ storyId: storyId || "" });
  const [allPaginatedResults, setAllPaginatedResults] = useState<AllMightySearchKeyResultTypes[]>([]);

  const memoizedKeys = useMemo(() => {
    const res: KeyTypes[] = [];
    if (keys?.length) {
      if (debouncedValue?.trim().length) {
        const newArr = keys.filter((k) => k.text?.toLowerCase()?.includes(debouncedValue.toLowerCase()));
        res.push(...newArr);
      }
    }
    return res;
  }, [keys, debouncedValue]);

  // When new key added I'll need to add it to allPaginatedResults or slice the last array inside allPaginatedResults

  const {
    data: paginatedKeys,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useGetPaginatedKey({ limit: 20, page: currentPage, storyId: storyId || "" });

  useEffect(() => {
    if (paginatedKeys?.pages) {
      setAllPaginatedResults((prev) => {
        const combinedResults = [...prev, ...paginatedKeys.pages];
        // Deduplicate by ensuring unique `next.page` values
        const deduplicatedResults = combinedResults.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t?.next?.page === item?.next?.page && t?.prev?.page === item?.prev?.page)
        );
        return deduplicatedResults;
      });
    }
  }, [paginatedKeys]);

  useEffect(() => {
    if (newElement !== null) {
      setAllPaginatedResults((prev) =>
        prev.map((page) => ({
          ...page,
          results: [...page.results, newElement],
        }))
      );
    }
  }, [newElement]);

  useEffect(() => {
    if (inView) {
      if (hasNextPage) {
        setCurrentPage((prev) => prev + 1);
        fetchNextPage();
      }
    }
  }, [inView, hasNextPage, fetchNextPage, currentPage]);

  return (
    <>
      {status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <div className="h-full flex flex-col gap-[1rem] overflow-auto | containerScroll">
          <div className="flex gap-[1rem] flex-wrap">
            {!debouncedValue?.trim().length
              ? allPaginatedResults?.map((p) =>
                  p?.results?.map((pr) => (
                    <PlotfieldButton
                      className="text-start w-fit bg-primary-darker flex-grow text-[1.5rem] p-[1rem]"
                      key={pr?._id}
                    >
                      {pr?.text || pr?._id}
                    </PlotfieldButton>
                  ))
                )
              : null}
            {debouncedValue?.trim().length
              ? memoizedKeys?.map((p) => (
                  <PlotfieldButton
                    className="text-start w-fit bg-primary-darker flex-grow text-[1.5rem] p-[1rem]"
                    key={p?._id}
                  >
                    {p?.text || p?._id}
                  </PlotfieldButton>
                ))
              : null}
          </div>

          <button
            ref={ref}
            className={`${debouncedValue?.trim().length ? "hidden" : ""} ${
              !allPaginatedResults[allPaginatedResults.length - 1]?.next
                ? "bg-primary-darker text-dark-mid-gray"
                : "hover:text-text-light  focus-within:text-text-light text-text-light"
            } text-[1.8rem] mt-[2rem] ml-auto w-fit hover:bg-primary transition-all active:bg-primary-darker rounded-md px-[1rem] py-[.5rem] whitespace-nowrap`}
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => {
              if (hasNextPage) {
                setCurrentPage((prev) => prev + 1);
                fetchNextPage();
              }
            }}
          >
            {!allPaginatedResults[allPaginatedResults.length - 1]?.next
              ? "Большей ключей нету"
              : isFetchingNextPage
              ? "Загрузка"
              : "Смотреть Больше"}
          </button>
        </div>
      )}
    </>
  );
}

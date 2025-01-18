import { Button } from "@/components/ui/button";
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

type PaginatedResult = {
  next: {
    page: number;
    limit: number;
  };
};

type LoadMoreButtonTypes<T extends PaginatedResult> = {
  hasNextPage: boolean;
  currentPage: number;
  debouncedValue: string;
  type: "звуков" | "ачивок" | "персонажей" | "ключей" | "одежды" | "характеристик" | "музыки";
  isFetchingNextPage: boolean;
  allPaginatedResults: T[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<T, unknown>, Error>>;
};

export default function LoadMoreButton<T extends PaginatedResult>({
  currentPage,
  isFetchingNextPage,
  allPaginatedResults,
  debouncedValue,
  hasNextPage,
  type,
  fetchNextPage,
  setCurrentPage,
}: LoadMoreButtonTypes<T>) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (hasNextPage) {
        setCurrentPage((prev) => prev + 1);
        fetchNextPage();
      }
    }
  }, [inView, hasNextPage, fetchNextPage, currentPage]);

  return (
    <Button
      ref={ref}
      className={`${debouncedValue?.trim().length ? "hidden" : ""} ${
        !allPaginatedResults[allPaginatedResults.length - 1]?.next ? "bg-background" : "bg-accent"
      } text-[18px] text-text mt-[20px] ml-auto w-fit transition-all rounded-md px-[10px] py-[5px] whitespace-nowrap`}
      disabled={!hasNextPage || isFetchingNextPage}
      onClick={() => {
        if (hasNextPage) {
          setCurrentPage((prev) => prev + 1);
          fetchNextPage();
        }
      }}
    >
      {!allPaginatedResults[allPaginatedResults.length - 1]?.next
        ? `Больше ${type} нету`
        : isFetchingNextPage
        ? "Загрузка"
        : "Смотреть Больше"}
    </Button>
  );
}

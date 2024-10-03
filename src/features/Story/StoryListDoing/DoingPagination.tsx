import { useEffect, useState } from "react";
import { MATCHMEDIA } from "../../../const/MATCHMEDIA";
import StoryItem from "../StoryItem";
import useMatchMedia from "../../../hooks/UI/useMatchMedia";
import useGetPaginatedStories from "../../../hooks/Fetching/Story/useGetPaginatedStories";
import PaginatedSkeleton from "../Skeleton/PaginatedSkeleton";

export default function DoingPagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [amountOfDoingStories, setAmountOfDoingStories] = useState(0);
  const [numberOfCurrentPages, setNumberOfCurrentPages] = useState<number[]>(
    []
  );

  const { isPending, isError, error, data, isPlaceholderData } =
    useGetPaginatedStories({
      limit: 10,
      page: currentPage,
      storyStatus: "doing",
    });

  useEffect(() => {
    if (data?.data.amountOfStories) {
      setAmountOfDoingStories(data.data.amountOfStories);
    }
  }, [data]);

  const isMobile = useMatchMedia(MATCHMEDIA.Mobile);

  useEffect(() => {
    updatePaginationButtons(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, currentPage, amountOfDoingStories]);

  const updatePaginationButtons = (page: number) => {
    const itemsPerPage = 10;
    const totalPages = Math.ceil(amountOfDoingStories / itemsPerPage);
    const maxPagesToShow = isMobile ? 5 : 10;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, page - halfPagesToShow);
    let endPage = Math.min(totalPages, page + halfPagesToShow);

    if (page - halfPagesToShow <= 0) {
      endPage = Math.min(totalPages, maxPagesToShow);
    }

    if (page + halfPagesToShow >= totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    const newPages = [];
    for (let i = startPage; i <= endPage; i++) {
      newPages.push(i);
    }
    setNumberOfCurrentPages(newPages);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isPending) {
    return <PaginatedSkeleton />;
  } else if (isError) {
    console.log(error.message);
    return (
      <div className="text-[2.5rem] text-gray-600">Something went wrong</div>
    );
  }
  console.log(data?.data);

  if (data?.data.amountOfStories === 0) {
    return (
      <div>
        <h1 className="text-[3.5rem] text-gray-600 text-center">
          Покамись это поле пустое
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[2rem]">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(25rem,1fr))] gap-[1rem] justify-items-center justify-center w-full">
        {data.data.results &&
          data.data.results.map((res) => <StoryItem key={res._id} {...res} />)}
      </div>
      <div className="flex gap-[1rem] items-center justify-center mx-auto">
        {numberOfCurrentPages.map((i) => {
          return (
            <button
              key={i as number}
              disabled={isPlaceholderData}
              onClick={() => handlePageChange(i)}
              className={`text-[1.5rem] p-[1rem] px-[1.5rem] rounded-md ${
                currentPage === i
                  ? "bg-primary-pastel-blue text-white"
                  : "bg-white"
              } shadow-sm hover:bg-primary-pastel-blue hover:text-white transition-all`}
            >
              {i as number}
            </button>
          );
        })}
      </div>
    </div>
  );
}

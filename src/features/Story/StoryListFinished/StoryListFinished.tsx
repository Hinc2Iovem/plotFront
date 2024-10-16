import { useState } from "react";
import FinishedCarousel from "./FinishedCarousel";
import FinishedPagination from "./FinishedPagination";

export default function StoryListFinished() {
  const [finishedStoriesCarousel, setFinishedStoriesCarousel] = useState(false);

  return (
    <div>
      <div className="flex sm:flex-row flex-col gap-[0rem] justify-between">
        <h2 className="text-[2.5rem] font-medium bg-secondary w-fit p-[1rem] rounded-md shadow-md mb-[1rem] text-gray-600">
          Законченные Истории
        </h2>
        <button
          onClick={() => setFinishedStoriesCarousel((prev) => !prev)}
          className="text-[1.5rem] self-end"
        >
          {finishedStoriesCarousel ? "Смотреть все" : "Скрыть"}
        </button>
      </div>
      {finishedStoriesCarousel ? <FinishedCarousel /> : <FinishedPagination />}
    </div>
  );
}

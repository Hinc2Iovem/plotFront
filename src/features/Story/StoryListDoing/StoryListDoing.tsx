import { useState } from "react";

import DoingCarousel from "./DoingCarousel";
import DoingPagination from "./DoingPagination";

export default function StoryListDoing() {
  const [doingStoriesCarousel, setDoingStoriesCarousel] = useState(true);

  return (
    <div>
      <div className="flex sm:flex-row flex-col gap-[0rem] justify-between">
        <h2 className="text-[2.5rem] font-medium bg-secondary w-fit p-[1rem] rounded-md shadow-md mb-[1rem] text-gray-600">
          Истории в Процессе
        </h2>
        <button
          onClick={() => setDoingStoriesCarousel((prev) => !prev)}
          className="text-[1.5rem] self-end"
        >
          {doingStoriesCarousel ? "Смотреть все" : "Скрыть"}
        </button>
      </div>
      {doingStoriesCarousel ? <DoingCarousel /> : <DoingPagination />}
    </div>
  );
}

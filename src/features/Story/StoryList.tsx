import { StoryFilterTypes } from "./Story";
import DoingPagination from "./StoryListDoing/DoingPagination";
import StoryListDoing from "./StoryListDoing/StoryListDoing";
import FinishedPagination from "./StoryListFinished/FinishedPagination";
import StoryListFinished from "./StoryListFinished/StoryListFinished";

type StoryListTypes = {
  storiesType: StoryFilterTypes;
};

export default function StoryList({ storiesType }: StoryListTypes) {
  return (
    <main className="flex flex-col gap-[3rem]">
      {storiesType === "all" ? (
        <>
          <StoryListFinished />
          <StoryListDoing />
        </>
      ) : storiesType === "done" ? (
        <FinishedPagination />
      ) : storiesType === "doing" ? (
        <DoingPagination />
      ) : null}
    </main>
  );
}

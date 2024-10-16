import StoryItemSkeleton from "./StoryItemSkeleton";

export default function PaginatedSkeleton() {
  return (
    <div className="flex flex-col gap-[2rem]">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(25rem,1fr))] gap-[1rem] justify-items-center justify-center w-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <StoryItemSkeleton key={i as number} />
        ))}
      </div>
      <div className="flex gap-[1rem] items-center justify-center mx-auto">
        {Array.from({ length: 3 }).map((_, i) => {
          return (
            <button
              key={i as number}
              className={`text-[1.5rem] p-[1rem] px-[1.5rem] rounded-md ${
                1 === i + 1
                  ? "bg-primary-darker text-text-dark"
                  : "bg-secondary"
              } shadow-sm hover:bg-primary-darker hover:text-text-dark transition-all`}
            >
              {(i + 1) as number}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useRef, useState, useTransition } from "react";
import { useParams } from "react-router-dom";
import useGetSeasonsByStoryId from "../../../hooks/Fetching/Season/useGetSeasonsByStoryId";
import useCreateNewSeason from "../../../hooks/Posting/Season/useCreateNewSeason";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import DisplaySeasons from "../DisplaySeasons";

export default function StoryMainContent() {
  const { storyId } = useParams();
  const { data: allSeasonsIds } = useGetSeasonsByStoryId({
    language: "russian",
    storyId: storyId || "",
  });
  return (
    <section className="flex flex-col w-full max-w-[148rem] mx-auto gap-[.5rem] p-[1rem] sm:my-0 my-[1rem]">
      <CreateSeasonBlock />
      <div className="flex w-full gap-[1rem] flex-wrap">
        {allSeasonsIds?.map((si, i) => (
          <DisplaySeasons key={si._id} index={i + 1} {...si} />
        ))}
      </div>
    </section>
  );
}

function CreateSeasonBlock() {
  const { storyId } = useParams();
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const createNewSeason = useCreateNewSeason({
    storyId: storyId || "",
    title,
    currentLanguage: "russian",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewSeason.mutate();

    setShowSeasonModal(false);
    startTransition(() => {
      setTitle("");
    });
  };

  useOutOfModal({
    modalRef,
    setShowModal: setShowSeasonModal,
    showModal: showSeasonModal,
  });

  return (
    <div className="relative ml-auto">
      <button
        disabled={isPending}
        onClick={(e) => {
          e.stopPropagation();
          setShowSeasonModal((prev) => !prev);
        }}
        className="px-[1rem] outline-gray-300 text-text-light hover:bg-primary-darker transition-colors py-[.5rem] shadow-sm bg-secondary rounded-md text-[2rem]"
      >
        Создать Сезон
      </button>
      <aside
        ref={modalRef}
        className={`${
          showSeasonModal ? "" : "hidden"
        } absolute translate-y-[.5rem] z-[2] shadow-md`}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Тайтл Сезона"
            className="w-full text-[1.4rem] text-text-light text-gray-500 px-[1rem] py-[.5rem]"
          />
        </form>
      </aside>
    </div>
  );
}

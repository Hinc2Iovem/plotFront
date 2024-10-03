import { useParams } from "react-router-dom";
import useGetSeasonsByStoryId from "../../hooks/Fetching/Season/useGetSeasonsByStoryId";
import DisplaySeasons from "./DisplaySeasons";
import useOutOfModal from "../../hooks/UI/useOutOfModal";
import { useRef, useState } from "react";
import useCreateNewSeason from "../../hooks/Posting/Season/useCreateNewSeason";

export default function StorySinglePageMain() {
  const { storyId } = useParams();
  const { data: allSeasonsIds } = useGetSeasonsByStoryId({
    storyId: storyId ?? "",
    language: "russian",
  });

  const [title, setTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const createNewEpisode = useCreateNewSeason({
    storyId: storyId ?? "",
    title,
    currentLanguage: "russian",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim().length) {
      console.log("title and description are required");
      return;
    }

    createNewEpisode.mutate();
    setShowModal(false);
  };

  useOutOfModal({ setShowModal, showModal, modalRef });

  return (
    <main className="flex flex-col gap-[2rem] mt-[5rem] mb-[3rem]">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setTitle("");
          setShowModal(true);
        }}
        className="text-[2.5rem] w-fit bg-white px-[1rem] py-[.5rem] rounded-md shadow-md self-end hover:scale-[1.01] active:scale-[0.99]"
      >
        Создать новый сезон
      </button>
      <div
        className={`${showModal ? "" : "hidden"} w-[25rem] self-end`}
        ref={modalRef}
      >
        <form
          onSubmit={handleSubmit}
          className={`w-full bg-white rounded-md shadow-sm flex flex-col gap-[1rem] p-[1rem]`}
        >
          <input
            type="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-[2rem] text-gray-700 border-double border-l-neutral-light-gray border-[3px] rounded-md px-[1rem] py-[.5rem] rounde-md outline-none"
            placeholder="Название Сезона"
          />

          <button className="w-fit self-end text-[1.5rem] shadow-md rounded-md px-[1rem] py-[.5rem] hover:scale-[1.01] active:scale-[0.98]">
            Создать
          </button>
        </form>
      </div>
      {allSeasonsIds?.map((si, i) => (
        <DisplaySeasons key={si._id} index={i + 1} {...si} />
      ))}
    </main>
  );
}

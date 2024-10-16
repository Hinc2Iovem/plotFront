import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useRef, useState, useTransition } from "react";
import add from "../../assets/images/shared/add.png";
import useGetEpisodesBySeasonId from "../../hooks/Fetching/Episode/useGetEpisodesBySeasonId";
import useUpdateEpisodeOrder from "../../hooks/Patching/Episode/useUpdateEpisodeOrder";
import useCreateNewEpisode from "../../hooks/Posting/Episode/useCreateNewEpisode";
import useOutOfModal from "../../hooks/UI/useOutOfModal";
import { TranslationSeasonTypes } from "../../types/Additional/TranslationTypes";
import ButtonHoverPromptModal from "../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import EpisodeItem from "./EpisodeItem";

type DisplaySeasonsTypes = {
  index: number;
} & TranslationSeasonTypes;

export default function DisplaySeasons({
  index,
  seasonId,
  translations,
}: DisplaySeasonsTypes) {
  const [seasonTitle] = useState(
    translations.find((t) => t.textFieldName === "seasonName")?.text || ""
  );
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-col w-full md:w-[calc(50%-0.5rem)] flex-grow bg-secondary p-[1rem] rounded-md">
        <div className="flex justify-between w-full items-center gap-[1rem]">
          <h2 className="text-[2.5rem] text-text-light border-b-[.1rem] rounded-md px-[.5rem]">
            {seasonTitle || `Сезон ${index}`}
          </h2>
          <ButtonHoverPromptModal
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            asideClasses="text-[1.5rem] top-[3.9rem] bottom-[-3.9rem] text-text-light"
            contentName="Создать Эпизод"
            positionByAbscissa="right"
            className="w-fit bg-secondary rounded-md shadow-sm shadow-gray-500 p-[.2rem]"
            variant={"rectangle"}
          >
            <img src={add} alt="NewEpisode" className="w-[3rem]" />
          </ButtonHoverPromptModal>
        </div>
        <div
          className={`${
            showModal ? "hidden" : ""
          } w-full h-[20rem] mt-[1rem] overflow-y-auto flex flex-col gap-[1rem] | containerScroll`}
        >
          <DisplayEpisodes seasonId={seasonId} />
        </div>
        <CreateEpisodeBlock
          seasonId={seasonId}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      </div>
    </>
  );
}

type DisplayEpisodesTypes = {
  seasonId: string;
};

function DisplayEpisodes({ seasonId }: DisplayEpisodesTypes) {
  const { data: fetchedEpisodes } = useGetEpisodesBySeasonId({
    seasonId,
  });

  useEffect(() => {
    if (fetchedEpisodes) {
      setEpisodes(fetchedEpisodes);
    }
  }, [fetchedEpisodes]);
  const [episodes, setEpisodes] = useState(fetchedEpisodes || []);
  const updateEpisodeOrder = useUpdateEpisodeOrder();
  const handleOnDragEnd = (result: DropResult) => {
    if (!result?.destination) return;

    const orderedEpisodes = [...(episodes ?? [])];
    const [reorderedItem] = orderedEpisodes.splice(result.source.index, 1);
    orderedEpisodes.splice(result.destination.index, 0, reorderedItem);
    updateEpisodeOrder.mutate({
      newOrder: result.destination.index,
      episodeId: result.draggableId,
    });
    setEpisodes(orderedEpisodes);
  };

  // useOutOfModal({ setShowModal, showModal, modalRef });

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="episodes">
        {(provided: DroppableProvided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex flex-col gap-[1rem]`}
          >
            {episodes?.length ? (
              episodes?.map((ei, i) => {
                return (
                  <Draggable key={ei._id} draggableId={ei._id} index={i}>
                    {(provided) => <EpisodeItem provided={provided} {...ei} />}
                  </Draggable>
                );
              })
            ) : (
              <li className="text-[1.5rem] text-text-light opacity-60 bg-secondary w-full rounded-md shadow-sm shadow-gray-300 p-[1rem] hover:scale-[1.01]">
                В этом сезоне покамись нету эпизодов
              </li>
            )}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

type CreateEpisodeBlockTypes = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  seasonId: string;
};

function CreateEpisodeBlock({
  seasonId,
  setShowModal,
  showModal,
}: CreateEpisodeBlockTypes) {
  const [isPending, startTransition] = useTransition();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null);

  const createNewEpisode = useCreateNewEpisode({
    description,
    seasonId,
    title,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim().length || !description.trim().length) {
      console.log("title and description are required");
      return;
    }
    createNewEpisode.mutate();
    startTransition(() => {
      setTitle("");
      setDescription("");
    });
    setShowModal(false);
  };

  useOutOfModal({ modalRef, setShowModal, showModal });

  return (
    <div
      ref={modalRef}
      className={`${
        showModal ? "" : "hidden"
      } h-[20rem] overflow-y-auto flex flex-col gap-[1rem] | containerScroll`}
    >
      <form
        onSubmit={handleSubmit}
        className={`w-full bg-secondary flex flex-col gap-[1rem] p-[1rem]`}
      >
        <input
          type="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-[2rem] text-text-light border-double border-l-light-gray border-[3px] rounded-md px-[1rem] py-[.5rem] rounde-md outline-none"
          placeholder="Название Эпизода"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-[1.5rem] text-text-light border-double border-l-light-gray border-[3px] rounded-md px-[1rem] py-[.5rem] rounde-md outline-none max-h-[30rem]"
          placeholder="Описание Эпизода"
        />
        <button
          disabled={isPending}
          className={` w-fit text-text-dark hover:text-text-light self-end outline-gray-300 text-[1.5rem] shadow-md rounded-md px-[1rem] py-[.5rem] hover:scale-[1.01] active:scale-[0.98]`}
        >
          Создать
        </button>
      </form>
    </div>
  );
}

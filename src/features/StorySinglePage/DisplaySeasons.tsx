import { Button } from "@/components/ui/button";
import { DragDropContext, Draggable, Droppable, DroppableProvided, DropResult } from "@hello-pangea/dnd";
import { useEffect, useRef, useState, useTransition } from "react";
import useGetEpisodesBySeasonId from "../../hooks/Fetching/Episode/useGetEpisodesBySeasonId";
import useUpdateEpisodeOrder from "../../hooks/Patching/Episode/useUpdateEpisodeOrder";
import useCreateNewEpisode from "../../hooks/Posting/Episode/useCreateNewEpisode";
import useOutOfModal from "../../hooks/UI/useOutOfModal";
import { TranslationSeasonTypes } from "../../types/Additional/TranslationTypes";
import EpisodeItem from "./EpisodeItem";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { toastErrorStyles } from "@/components/shared/toastStyles";

type DisplaySeasonsTypes = {
  index: number;
} & TranslationSeasonTypes;

export default function DisplaySeasons({ index, seasonId, translations }: DisplaySeasonsTypes) {
  const [seasonTitle] = useState(translations.find((t) => t.textFieldName === "seasonName")?.text || "");
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="w-full h-[450px] rounded-md border-border border-[1px] p-[10px] transition-all flex flex-col">
        <div className="flex justify-between w-full items-center gap-[10px] bg-secondary border-border border-[1px] rounded-md p-[5px]">
          <h2 className="text-[30px] text-heading capitalize rounded-md px-[5px]">{seasonTitle || `Сезон ${index}`}</h2>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className={`${
              showModal
                ? "bg-accent hover:shadow-accent text-white/80"
                : "bg-brand-gradient hover:shadow-brand-gradient-right text-white"
            } px-[10px] py-[20px] text-[26px] rounded-md hover:shadow-sm active:scale-[.99] transition-all`}
          >
            + Эпизод
          </Button>
        </div>
        <div
          className={`${
            showModal ? "hidden" : ""
          } w-full mt-[10px] overflow-y-auto flex flex-grow flex-col gap-[10px] | containerScroll`}
        >
          <DisplayEpisodes seasonId={seasonId} />
        </div>
        <CreateEpisodeBlock seasonId={seasonId} setShowModal={setShowModal} showModal={showModal} />
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
          <ul {...provided.droppableProps} ref={provided.innerRef} className={`flex flex-col gap-[10px]`}>
            {episodes?.length ? (
              episodes?.map((ei, i) => {
                return (
                  <Draggable key={ei._id} draggableId={ei._id} index={i}>
                    {(provided) => <EpisodeItem provided={provided} {...ei} />}
                  </Draggable>
                );
              })
            ) : (
              <li className="text-[15px] text-text opacity-60 border-border border-[1px] w-full rounded-md px-[10px] py-[5px]">
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

function CreateEpisodeBlock({ seasonId, setShowModal, showModal }: CreateEpisodeBlockTypes) {
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
      toast("Тайтл или описание отсутствует", toastErrorStyles);
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
      } flex-grow h-full overflow-y-auto flex flex-col gap-[10px] | containerScroll`}
    >
      <form onSubmit={handleSubmit} className={`w-full flex flex-col gap-[10px] p-[10px]`}>
        <Input
          type="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-text border-double border-border border-[3px] rounded-md px-[10px] py-[5px] rounde-md"
          placeholder="Название Эпизода"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-text border-double border-border border-[3px] rounded-md px-[10px] py-[5px] rounde-md max-h-[300px] min-h-[150px]"
          placeholder="Описание Эпизода"
        />
        <Button
          type="submit"
          disabled={isPending}
          className={`text-white hover:shadow-sm bg-brand-gradient hover:shadow-brand-gradient-right self-end text-[16px] rounded-md px-[10px] py-[20px] active:scale-[.99] transition-all`}
        >
          Создать
        </Button>
      </form>
    </div>
  );
}
